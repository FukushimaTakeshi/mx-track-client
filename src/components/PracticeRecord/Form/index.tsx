import CreateIcon from '@mui/icons-material/Create'
import {
  Avatar,
  Button,
  Container,
  CssBaseline,
  Dialog,
  Grid,
  TextField,
  Typography
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useHistory } from 'react-router-dom'
import { useAsyncExecutor } from '../../../hooks/useAsyncExecutor'
import { formToObject, responseToForm, useForm } from '../../../hooks/useForm'
import { apiClientWithAuth } from '../../../lib/api_client'
import ErrorNotification from '../../Notification/ErrorNotification'
import SuccessNotification from '../../Notification/SuccessNotification'
import HandleFetch from '../../Spinner/HandleFetch'
import { Dashboard } from '../../templates/Dashboard'
import TimeOrDecimalForm from '../../Time/TimeOrDecimalForm'
import UserVehicleSelect from '../../Vehicle/UserVehicleSelect'
import RegionList from './RegionList'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#e6e6e6',
  },
}))

const usePracticeRecordForm = () => {
  const practiceDate = useForm('')
  const offRoadTrack = useForm({} as Models.OffRoadTrack)
  const userVehicle = useForm({} as Models.UserVehicle)
  const hours = useForm<number>()
  const minutes = useForm<number>()
  const memo = useForm('')
  return {
    practiceDate,
    offRoadTrack,
    userVehicle,
    hours,
    minutes,
    memo,
  }
}

const setRecentTrack = (track: Models.OffRoadTrack) => {
  const recentTracks = localStorage.getItem('recent-tracks')
  let newRecentTracks = []
  if (recentTracks) {
    const currentTracks: Models.OffRoadTrack[] = JSON.parse(recentTracks)
    const tracks = currentTracks.filter(({ id }) => id !== track.id)
    tracks.unshift(track)
    newRecentTracks = tracks.length > 5 ? tracks.slice(0, 5) : tracks
  } else {
    newRecentTracks.push(track)
  }
  localStorage.setItem('recent-tracks', JSON.stringify(newRecentTracks))
}

const Form: React.FC = () => {
  const classes = useStyles()
  const form = usePracticeRecordForm()
  const { id } = useParams<{ id?: string }>()
  const history = useHistory()
  const validator = () => {
    // TODO: validate
    return true
  }

  const save = useAsyncExecutor(() => {
    setSuccess(false)
    const params = {
      ...formToObject(form),
      offRoadTrackId: form.offRoadTrack.value.id,
      userVehicleId: form.userVehicle.value.id,
    }
    const request = id
      ? apiClientWithAuth.put(`/practice_records/${id}`, params)
      : apiClientWithAuth.post(`/practice_records/`, params)
    return request.then(() => {
      setRecentTrack(form.offRoadTrack.value)
      setSuccess(true)
    })
  }, validator)

  useEffect(() => {
    const fetchPracticeRecord = () => {
      if (id) {
        apiClientWithAuth.get(`/practice_records/${id}`).then((response) => {
          responseToForm(response, form)
        })
      }
    }
    fetchPracticeRecord()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const [success, setSuccess] = useState(false)

  const [showRegion, setShowRegion] = useState(false)
  const handleSelectTrack = () => setShowRegion(true)
  const handleCloseRegion = () => setShowRegion(false)

  const [operationTotalTime, setOperationTotalTime] = useState<{
    hours: number
    minutes: number
  } | null>(null)
  useEffect(() => {
    if (form.userVehicle.value.id) {
      apiClientWithAuth
        .get(`/operation_time/?user_vehicle_id=${form.userVehicle.value.id}`)
        .then((response) => {
          const { hours, minutes } = response.data
          setOperationTotalTime({ hours, minutes })
        })
    }
  }, [form.userVehicle.value.id])

  const totalTime = (timeFormat: string) => {
    if (!operationTotalTime) return null
    const { hours, minutes } = operationTotalTime
    return timeFormat === 'time'
      ? `${hours}時間${minutes}分`
      : `${hours}.${Math.round(Number(minutes) / 6)}時間`
  }

  return (
    <Dashboard>
      <HandleFetch loading={save.isExecuting}>
        <SuccessNotification
          open={success}
          onClose={() => history.push('/dashboard')}
          message="登録しました !"
        />
        <ErrorNotification task={save} />
        <Container component="main" maxWidth="xs">
          <Dialog
            fullScreen
            open={showRegion}
            onClose={() => setShowRegion(false)}
          >
            <RegionList
              onClose={handleCloseRegion}
              handleSelectTrack={form.offRoadTrack.setValue}
            ></RegionList>
          </Dialog>
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <CreateIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              練習記録
            </Typography>
            <div className={classes.form}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    id="date"
                    name="practiceDate"
                    fullWidth
                    value={form.practiceDate.value}
                    required
                    label="練習日付"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={form.practiceDate.setValueFromEvent}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={handleSelectTrack}
                  >
                    コース選択
                  </Button>
                  {form.offRoadTrack.value.id && (
                    <Grid item xs={12}>
                      <Typography variant="caption" color="textSecondary">
                        コース
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {form.offRoadTrack.value.name}
                      </Typography>
                    </Grid>
                  )}
                </Grid>

                <UserVehicleSelect
                  userVehicleForm={form.userVehicle}
                  setCurrentVehicle={!id}
                />

                <TimeOrDecimalForm
                  title="走行時間"
                  hours={form.hours}
                  minutes={form.minutes}
                  secondaryContent={(timeFormat) => (
                    <Grid container justifyContent="flex-end" spacing={2}>
                      <Grid item>
                        <Typography variant="caption" color="textSecondary">
                          現在の稼働時間は {totalTime(timeFormat)} です
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                />
                <Grid item xs={12}>
                  <TextField
                    name="memo"
                    variant="outlined"
                    fullWidth
                    label="メモ"
                    multiline
                    rows={4}
                    placeholder="タイムやセッティングなどのメモ"
                    value={form.memo.value}
                    onChange={form.memo.setValueFromEvent}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={save.execute}
                disabled={save.isExecuting}
              >
                送信
              </Button>
            </div>
          </div>
        </Container>
      </HandleFetch>
    </Dashboard>
  )
}

export default Form
