import {
  Avatar,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Dialog,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ClearIcon from '@material-ui/icons/Clear'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Autocomplete from '@material-ui/lab/Autocomplete'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { apiClient, apiClientWithAuth } from '../../../lib/api_client'
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
}))

const Form = () => {
  const classes = useStyles()
  const { id } = useParams()
  const [inputState, setInputState] = useState({})

  const handleChange = (event) => {
    setInputState({ ...inputState, [event.target.name]: event.target.value })
  }

  const handleSubmit = async () => {
    const { track, ...restState } = inputState
    const params = {
      ...restState,
      offRoadTrackId: track.id,
    }

    let res
    if (id) {
      res = await apiClientWithAuth.put(`/practice_records/${id}`, params)
    } else {
      res = await apiClientWithAuth.post(`/practice_records/`, params)
    }

    if (res.status === 201) {
      console.log('OK')
    } else {
      console.log('NG')
    }
  }

  useEffect(() => {
    const fetchPracticeRecord = () => {
      if (!id) return
      apiClientWithAuth.get(`/practice_records/${id}`, {}).then((res) => {
        setInputState(res.data)
      })
    }
    fetchPracticeRecord()
  }, [id])

  const [tracksOptions, setTrackOptions] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchOptions = () => {
    if (tracksOptions.length) {
      return
    }
    setLoading(true)
    apiClient.get('/regions/').then((res) => {
      setTrackOptions(res.data)
      setLoading(false)
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

  return (
    <Container component="main" maxWidth="xs">
      <Dialog fullScreen open={showModal} onClose={handleCloseModal}>
        <PrefectureList
          regionId={inputState.regionId}
          onClose={handleCloseModal}
          handleSelectTrack={handleSelectTrack}
        ></PrefectureList>
      </Dialog>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
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
                id="combo-box-demo"
                onOpen={fetchOptions}
                onClose={!loading && handleCloseSelect}
                options={tracksOptions}
                getOptionLabel={(option) => option.name}
                loading={loading}
                onChange={onChangeSelect}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="エリア"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
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
              <InputLabel>走行時間</InputLabel>
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
  )
}

export default Form
