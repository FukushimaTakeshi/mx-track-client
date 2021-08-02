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
import { apiClient, apiClientWithAuth } from '../../../lib/api_client'
import HandleFetch from '../../Spinner/HandleFetch'
import SuccessSnackbar from '../../SuccessSnackbar'
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

const Form = () => {
  const classes = useStyles()
  const { id } = useParams()
  const [inputState, setInputState] = useState({})

  const handleChange = (event) => {
    setInputState({ ...inputState, [event.target.name]: event.target.value })
  }

  const history = useHistory()

  const handleSubmit = async () => {
    setLoading(true)
    setSuccess(false)
    const { track, userVehicle, ...restState } = inputState
    const params = {
      ...restState,
      offRoadTrackId: track.id,
      userVehicleId: userVehicle.id,
    }

    id
      ? await apiClientWithAuth.put(`/practice_records/${id}`, params)
      : await apiClientWithAuth.post(`/practice_records/`, params)
    setInputState({})
    setLoading(false)
    setSuccess(true)
  }

  const [userVehicles, setUserVehicles] = useState([])

  useEffect(() => {
    const fetchUserVehicles = async () => {
      apiClientWithAuth
        .get('/user_vehicles/')
        .then((response) => setUserVehicles(response.data))
    }

    const fetchCurrentVehicles = () => {
      apiClientWithAuth.get('/current_vehicles').then((response) => {
        const foundUserVehicle = userVehicles.find(
          ({ id }) => id == response.data.userVehicleId
        )
        setInputState({
          ...inputState,
          userVehicle: foundUserVehicle ? foundUserVehicle : {},
        })
      })
    }

    const fetchPracticeRecord = async () => {
      await fetchUserVehicles()
      if (id) {
        apiClientWithAuth.get(`/practice_records/${id}`).then((response) => {
          setInputState(response.data)
          !response.data.userVehicle && fetchCurrentVehicles()
        })
      } else {
        fetchCurrentVehicles()
      }
      // TODO: エラー処理
    }
    fetchPracticeRecord()
  }, [id])

  const [tracksOptions, setTrackOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [optionsLoading, setOptionsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const fetchOptions = () => {
    if (inputState.regionId) {
      setInputState({ ...inputState, regionId: null })
    }
    if (tracksOptions.length) {
      return
    }
    setOptionsLoading(true)
    apiClient.get('/regions/').then((res) => {
      setTrackOptions(res.data)
      setOptionsLoading(false)
    })
  }

  const onChangeSelect = (e, value) => {
    if (!value) return
    setInputState({ ...inputState, regionId: value.id })
  }

  const [showModal, setShowModal] = useState(false)

  const handleCloseSelect = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleSelectTrack = (track) => {
    setInputState({ ...inputState, track: { id: track.id, name: track.name } })
  }

  const handleClearTrack = () => {
    const { track, ...rest } = inputState
    if (!track) return
    setInputState(rest)
  }

  const handleChangeUserVehicle = (event, newUserVehicle) => {
    setInputState({ ...inputState, userVehicle: newUserVehicle })
  }

  return (
    <Dashboard>
      <HandleFetch loading={loading}>
        <Container component="main" maxWidth="xs">
          <Dialog
            fullScreen
            open={showModal && !!inputState.regionId}
            onClose={handleCloseModal}
          >
            <PrefectureList
              regionId={inputState.regionId}
              onClose={handleCloseModal}
              handleSelectTrack={handleSelectTrack}
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
                    value={inputState.practiceDate}
                    variant="outlined"
                    required
                    label="練習日付"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Autocomplete
                    disablePortal
                    onOpen={fetchOptions}
                    onClose={!optionsLoading && handleCloseSelect}
                    options={tracksOptions}
                    getOptionLabel={(option) => option.name}
                    loading={optionsLoading}
                    onChange={onChangeSelect}
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
                {inputState.track && (
                  <React.Fragment>
                    <Grid item xs={7}>
                      <Typography variant="caption" color="textSecondary">
                        コース
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {inputState.track.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <ClearIcon
                        color="disabled"
                        fontSize="small"
                        onClick={handleClearTrack}
                      />
                    </Grid>
                  </React.Fragment>
                )}

                <Grid item xs={12}>
                  <Autocomplete
                    key={inputState.userVehicle}
                    disablePortal
                    value={inputState.userVehicle}
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
                            value={Number(inputState.hours)}
                            onChange={handleChange}
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
                            value={Number(inputState.minutes)}
                            onChange={handleChange}
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
                    value={inputState.memo}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={handleSubmit}
              >
                送信
              </Button>
            </div>
          </div>
        </Container>
        {success && (
          <SuccessSnackbar
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
