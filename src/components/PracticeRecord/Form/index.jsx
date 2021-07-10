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
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Autocomplete from '@material-ui/lab/Autocomplete'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { apiClient } from '../../../lib/api_client'
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
    const token = localStorage.getItem('token')
    const params = {
      practice_date: inputState.practiceDate,
      hours: inputState.hours,
      minutes: inputState.minutes,
      memo: inputState.memo,
    }

    let res
    if (id) {
      res = await apiClient.put(`/practice_records/${id}`, params, {
        headers: { Authorization: `Bearer ${token}` },
      })
    } else {
      res = await apiClient.post(`/practice_records/`, params, {
        headers: { Authorization: `Bearer ${token}` },
      })
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
      const token = localStorage.getItem('token')
      apiClient
        .get(`/practice_records/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setInputState({
            practiceDate: res.data.practice_date,
            hours: res.data.hours,
            minutes: res.data.minutes,
            memo: res.data.memo,
          })
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

  return (
    <Container component="main" maxWidth="xs">
      <Dialog fullScreen open={showModal} onClose={handleCloseModal}>
        <PrefectureList
          regionId={inputState.regionId}
          handleClose={handleCloseModal}
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
            <Grid item xs={12}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                onOpen={fetchOptions}
                onClose={handleCloseSelect}
                options={tracksOptions}
                getOptionLabel={(option) => option.name}
                loading={loading}
                onChange={onChangeSelect}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="コース"
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
                sx={{ width: 300 }}
              />
            </Grid>

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
