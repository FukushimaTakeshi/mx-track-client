import {
  Avatar,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Dialog,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ClearIcon from '@material-ui/icons/Clear'
import CreateIcon from '@material-ui/icons/Create'
import Autocomplete from '@material-ui/lab/Autocomplete'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useHistory } from 'react-router-dom'
import { useAsyncExecutor } from '../../../hooks/useAsyncExecutor'
import { useForm } from '../../../hooks/useForm'
import { apiClient, apiClientWithAuth } from '../../../lib/api_client'
import ErrorNotification from '../../Notification/ErrorNotification'
import SuccessNotification from '../../Notification/SuccessNotification'
import HandleFetch from '../../Spinner/HandleFetch'
import { Dashboard } from '../../templates/Dashboard'
import PrefectureList from '../../Track/PrefectureList'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
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
  const regionId = useForm()
  const practiceDate = useForm()
  const track = useForm()
  const userVehicle = useForm()
  const hours = useForm()
  const minutes = useForm()
  const memo = useForm()
  return {
    regionId,
    practiceDate,
    track,
    userVehicle,
    hours,
    minutes,
    memo,
  }
}

const Form = () => {
  const classes = useStyles()
  const form = usePracticeRecordForm()
  const { id } = useParams()
  const history = useHistory()
  const validator = () => {
    // TODO: validate
    return true
  }

  const save = useAsyncExecutor(() => {
    setSuccess(false)
    const params = {
      practiceDate: form.practiceDate.value,
      offRoadTrackId: form.track.value.id,
      userVehicleId: form.userVehicle.value.id,
      hours: form.hours.value,
      minutes: form.minutes.value,
      memo: form.memo.value,
    }
    const request = id
      ? apiClientWithAuth.put(`/practice_records/${id}`, params)
      : apiClientWithAuth.post(`/practice_records/`, params)
    return request.then(() => setSuccess(true))
  }, validator)

  const [userVehicles, setUserVehicles] = useState([])

  useEffect(() => {
    apiClientWithAuth
      .get('/user_vehicles/')
      .then((response) => setUserVehicles(response.data))
  }, [])

  useEffect(() => {
    const fetchCurrentVehicles = () => {
      apiClientWithAuth.get('/current_vehicles').then((response) => {
        const foundUserVehicle = userVehicles.find(
          ({ id }) => id == response.data.userVehicleId
        )
        form.userVehicle.setValue(foundUserVehicle ? foundUserVehicle : {})
      })
    }

    const setFormValues = (data = {}) => {
      form.practiceDate.setValue(data.practiceDate || '')
      form.track.setValue(data.track)
      form.userVehicle.setValue(data.userVehicle)
      form.hours.setValue(data.hours)
      form.minutes.setValue(data.minutes)
      form.memo.setValue(data.memo || '')
    }

    const fetchPracticeRecord = async () => {
      if (id) {
        apiClientWithAuth.get(`/practice_records/${id}`).then((response) => {
          setFormValues(response.data)
          !response.data.userVehicle && fetchCurrentVehicles()
        })
      } else {
        setFormValues()
        fetchCurrentVehicles()
      }
      // TODO: エラー処理
    }
    fetchPracticeRecord()
  }, [id])

  const [tracksOptions, setTrackOptions] = useState([])
  const [optionsLoading, setOptionsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const fetchRegions = () => {
    form.regionId.setValue(null)
    if (tracksOptions.length) {
      return
    }
    setOptionsLoading(true)
    apiClient.get('/regions/').then((res) => {
      setTrackOptions(res.data)
      setOptionsLoading(false)
    })
  }

  const onChangeRegion = (e, value) => {
    if (!value) return
    form.regionId.setValue(value.id)
  }

  const [showModal, setShowModal] = useState(false)
  const handleCloseSelect = () => setShowModal(true)
  const handleCloseModal = () => setShowModal(false)

  const handleChangeUserVehicle = (e, newUserVehicle) =>
    form.userVehicle.setValue(newUserVehicle)

  return (
    <Dashboard>
      <HandleFetch loading={save.isExecuting}>
        <ErrorNotification task={save} />
        <Container component="main" maxWidth="xs">
          <Dialog
            fullScreen
            open={showModal && !!form.regionId.value}
            onClose={handleCloseModal}
          >
            <PrefectureList
              regionId={form.regionId.value}
              onClose={handleCloseModal}
              handleSelectTrack={form.track.setValue}
            ></PrefectureList>
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
                    value={form.practiceDate.value}
                    variant="outlined"
                    required
                    label="練習日付"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={form.practiceDate.setValueFromEvent}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Autocomplete
                    disablePortal
                    onOpen={fetchRegions}
                    onClose={!optionsLoading && handleCloseSelect}
                    options={tracksOptions}
                    getOptionLabel={(option) => option.name}
                    loading={optionsLoading}
                    onChange={onChangeRegion}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="エリア"
                        required
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {optionsLoading && (
                                <CircularProgress color="inherit" size={20} />
                              )}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                {form.track.value && (
                  <React.Fragment>
                    <Grid item xs={7}>
                      <Typography variant="caption" color="textSecondary">
                        コース
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {form.track.value.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <ClearIcon
                        color="disabled"
                        fontSize="small"
                        onClick={() => form.track.setValue({})}
                      />
                    </Grid>
                  </React.Fragment>
                )}

                <Grid item xs={12}>
                  <Autocomplete
                    key={form.userVehicle.value}
                    disablePortal
                    value={form.userVehicle.value}
                    options={userVehicles}
                    getOptionLabel={(option) =>
                      option.vehicle ? option.vehicle.name : ''
                    }
                    onChange={handleChangeUserVehicle}
                    renderInput={(params) => (
                      <TextField {...params} label="バイク" required />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="caption" color="textSecondary">
                    走行時間
                  </Typography>
                  <Grid container justify="flex-end" spacing={2}>
                    <Grid item>
                      <FormControlLabel
                        control={
                          <Select
                            name="hours"
                            value={Number(form.hours.value) || 0}
                            onChange={form.hours.setValueFromEvent}
                            label="時"
                          >
                            {[...Array(24).keys()].map((value) => (
                              <MenuItem key={value} value={value}>
                                {value}
                              </MenuItem>
                            ))}
                          </Select>
                        }
                        label="時間"
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        control={
                          <Select
                            name="minutes"
                            value={Number(form.minutes.value) || 0}
                            onChange={form.minutes.setValueFromEvent}
                            label="分"
                          >
                            {[...Array(60).keys()].map((value) => (
                              <MenuItem key={value} value={value}>
                                {value}
                              </MenuItem>
                            ))}
                          </Select>
                        }
                        label="分"
                      />
                    </Grid>
                  </Grid>
                </Grid>
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
        {success && (
          <SuccessNotification
            open={success}
            onClose={() => history.push('/mypage')}
            message="登録しました !"
          />
        )}
      </HandleFetch>
    </Dashboard>
  )
}

export default Form
