import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import React, { useEffect, useState } from 'react'
import { apiClient } from '../lib/api_client'

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

const PracticeRecordForm = () => {
  const classes = useStyles()
  const [inputState, setInputState] = useState({})

  const handleChange = (event) => {
    setInputState({ ...inputState, [event.target.name]: event.target.value })
  }

  const handleSubmit = async () => {
    const token = localStorage.getItem('token')
    const res = await apiClient.post(
      `/practice_records/`,
      {
        practice_date: inputState.practiceDate,
        hours: inputState.hours,
        minutes: inputState.minutes,
        memo: inputState.memo,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (res.status === 201) {
      console.log('OK')
    } else {
      console.log('NG')
    }
  }

  useEffect(() => {
    fetchSamples()
  }, [])

  const fetchSamples = async () => {
    const token = localStorage.getItem('token')

    apiClient
      .get('/samples', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          練習記録
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                id="date"
                name="practiceDate"
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
              <FormControl variant="outlined" fullWidth>
                <InputLabel required>コース</InputLabel>
                <Select
                  name="course"
                  value={inputState.course}
                  onChange={handleChange}
                  label="コース"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <InputLabel>走行時間</InputLabel>
              <Grid container justify="flex-end" spacing={2}>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Select
                        name="hours"
                        value={inputState.hour}
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
                        value={inputState.minute}
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
          >
            送信
          </Button>
        </form>
      </div>
    </Container>
  )
}

export default PracticeRecordForm
