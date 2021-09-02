import {
  Avatar,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Dialog,
  FormControlLabel,
  Grid,
  InputAdornment,
  NativeSelect,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ClearIcon from '@material-ui/icons/Clear'
import CreateIcon from '@material-ui/icons/Create'
import Autocomplete from '@material-ui/lab/Autocomplete'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useHistory } from 'react-router-dom'
import { useAsyncExecutor } from '../../../hooks/useAsyncExecutor'
import { formToObject, responseToForm, useForm } from '../../../hooks/useForm'
import { apiClient, apiClientWithAuth } from '../../../lib/api_client'
import ErrorNotification from '../../Notification/ErrorNotification'
import SuccessNotification from '../../Notification/SuccessNotification'
import HandleFetch from '../../Spinner/HandleFetch'
import { Dashboard } from '../../templates/Dashboard'
import PrefectureList from '../../Track/PrefectureList'
import TimesDialog from './TimesDialog'

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
  const regionId = useForm<number | null>()
  const practiceDate = useForm('')
  const track = useForm({} as Models.OffRoadTrack)
  const userVehicle = useForm({} as Models.UserVehicle)
  const hours = useForm<number>()
  const minutes = useForm<number>()
  const memo = useForm('')
  const times = useForm<number>()
  return {
    regionId,
    practiceDate,
    track,
    userVehicle,
    hours,
    minutes,
    memo,
    times,
  }
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
      minutes:
        timeFormat === 'time'
          ? form.minutes.value
          : Number(form.minutes.value) * 6,
      offRoadTrackId: form.track.value.id,
      userVehicleId: form.userVehicle.value.id,
    }
    const request = id
      ? apiClientWithAuth.put(`/practice_records/${id}`, params)
      : apiClientWithAuth.post(`/practice_records/`, params)
    return request.then(() => setSuccess(true))
  }, validator)

  const [userVehicles, setUserVehicles] = useState<Models.UserVehicle[]>([])

  useEffect(() => {
    apiClientWithAuth
      .get('/user_vehicles/')
      .then((response) => setUserVehicles(response.data))
  }, [])

  useEffect(() => {
    const fetchCurrentVehicles = () => {
      apiClientWithAuth.get('/current_vehicles').then((response) => {
        const foundUserVehicle = userVehicles.find(
          ({ id }) => id === response.data.id
        )
        form.userVehicle.setValue(
          foundUserVehicle ?? ({} as Models.UserVehicle)
        )
      })
    }

    const fetchPracticeRecord = () => {
      if (!userVehicles.length) return
      if (id) {
        apiClientWithAuth.get(`/practice_records/${id}`).then((response) => {
          responseToForm(response, form)
          const { hours, minutes } = response.data
          form.times.setValue(parseFloat(`${hours}.${Math.round(minutes / 6)}`))
          !response.data.userVehicle && fetchCurrentVehicles()
        })
      } else {
        fetchCurrentVehicles()
      }
      // TODO: エラー処理
    }
    fetchPracticeRecord()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, userVehicles])

  const [tracksOptions, setTrackOptions] = useState<Models.Region[]>([])
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

  const onChangeRegion = (e: any, value: Models.Region | null) => {
    if (!value) return
    form.regionId.setValue(value.id)
  }

  const [showModal, setShowModal] = useState(false)
  const handleCloseSelect = () => setShowModal(true)
  const handleCloseModal = () => setShowModal(false)

  const handleChangeUserVehicle = (
    e: any,
    newUserVehicle: Models.UserVehicle | null
  ) => form.userVehicle.setValue(newUserVehicle ?? ({} as Models.UserVehicle))

  const [timeFormat, setTimeFormat] = useState('time')
  const handleChangeTimeFormat = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.value === 'time') {
      form.minutes.setValue(Number(form.minutes.value) * 6)
    } else {
      const minute = Math.round(Number(form.minutes.value) / 6)
      form.minutes.setValue(minute)
      form.times.setValue(parseFloat(`${form.hours.value}.${minute}`))
    }
    setTimeFormat(event.target.value)
  }

  const [openTimesDialog, setOpenTimesDialog] = useState(false)
  const handleClickTimes = () => setOpenTimesDialog(true)
  const handleCloseTimesDialog = () => setOpenTimesDialog(false)
  const handleSubmitTimes = () => {
    handleCloseTimesDialog()
    form.times.setValue(parseFloat(`${form.hours.value}.${form.minutes.value}`))
  }

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

  const totalTime = () => {
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
          onClose={() => history.push('/mypage')}
          message="登録しました !"
        />
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
                    onClose={() => !optionsLoading && handleCloseSelect()}
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
                        onClick={() =>
                          form.track.setValue({} as Models.OffRoadTrack)
                        }
                      />
                    </Grid>
                  </React.Fragment>
                )}

                <Grid item xs={12}>
                  <Autocomplete
                    key={form.userVehicle.value.id}
                    disablePortal
                    value={form.userVehicle.value}
                    options={userVehicles}
                    getOptionLabel={(option) =>
                      option.vehicle ? option.vehicle.modelName : ''
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

                  <Grid item xs={12}>
                    <RadioGroup
                      row
                      aria-label="time-format"
                      name="timeFormat"
                      value={timeFormat}
                      onChange={handleChangeTimeFormat}
                    >
                      <FormControlLabel
                        value="time"
                        control={<Radio />}
                        label={<Typography variant="caption">時刻</Typography>}
                      />
                      <FormControlLabel
                        value="decimal"
                        control={<Radio />}
                        label={
                          <Typography variant="caption">小数点</Typography>
                        }
                      />
                    </RadioGroup>
                  </Grid>
                  <Grid container justifyContent="flex-end" spacing={2}>
                    {timeFormat === 'time' ? (
                      <>
                        <Grid item>
                          <FormControlLabel
                            control={
                              <NativeSelect
                                name="hours"
                                value={form.hours.value || 0}
                                onChange={form.hours.setValueFromEvent}
                              >
                                {[...Array(24).keys()].map((value) => (
                                  <option key={value} value={value}>
                                    {value}
                                  </option>
                                ))}
                              </NativeSelect>
                            }
                            label="時間"
                          />
                        </Grid>
                        <Grid item>
                          <FormControlLabel
                            control={
                              <NativeSelect
                                name="minutes"
                                value={form.minutes.value || 0}
                                onChange={form.minutes.setValueFromEvent}
                              >
                                {[...Array(60).keys()].map((value) => (
                                  <option key={value} value={value}>
                                    {value}
                                  </option>
                                ))}
                              </NativeSelect>
                            }
                            label="分"
                          />
                        </Grid>
                      </>
                    ) : (
                      <Grid item xs={4}>
                        <TextField
                          name="time"
                          value={form.times.value}
                          onClick={handleClickTimes}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Typography
                                  variant="button"
                                  color="textSecondary"
                                >
                                  時間
                                </Typography>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    )}
                    <TimesDialog
                      open={openTimesDialog}
                      onClose={handleCloseTimesDialog}
                      form={form}
                      handleSubmit={handleSubmitTimes}
                    />
                  </Grid>
                  <Grid container justifyContent="flex-end" spacing={2}>
                    <Grid item>
                      <Typography variant="caption" color="textSecondary">
                        現在の稼働時間は {totalTime()} です
                      </Typography>
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
      </HandleFetch>
    </Dashboard>
  )
}

export default Form
