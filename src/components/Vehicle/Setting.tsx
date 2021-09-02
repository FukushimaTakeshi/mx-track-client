import {
  AppBar,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Toolbar,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import React, { useEffect, useState } from 'react'
import { useAsyncExecutor } from '../../hooks/useAsyncExecutor'
import { useForm } from '../../hooks/useForm'
import { apiClientWithAuth } from '../../lib/api_client'
import ErrorNotification from '../Notification/ErrorNotification'
import SuccessNotification from '../Notification/SuccessNotification'
import HandleFetch from '../Spinner/HandleFetch'

type Props = {
  id: number
  onClose(): void
}

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

const useVehicleSettingForm = () => {
  const initialHours = useForm(0)
  const initialMinutes = useForm(0)
  return { initialHours, initialMinutes }
}

const Setting: React.FC<Props> = ({ id, onClose }) => {
  const classes = useStyles()
  const form = useVehicleSettingForm()
  const [userVehicle, setUserVehicle] = useState<Models.SettingUserVehicle>(
    {} as Models.SettingUserVehicle
  )
  useEffect(() => {
    apiClientWithAuth.get(`/user_vehicles/${id}`).then((response) => {
      setUserVehicle(response.data)
      form.initialHours.setValue(response.data.initialHours)
      form.initialMinutes.setValue(response.data.initialMinutes)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleClose = () => {
    onClose()
  }
  const [success, setSuccess] = useState(false)

  const save = useAsyncExecutor(
    () => {
      const params = {
        initialHours: form.initialHours.value,
        initialMinutes: form.initialMinutes.value,
      }
      return apiClientWithAuth
        .put(`/user_vehicles/${id}`, params)
        .then(() => setSuccess(true))
    },
    () => true // TODO: validator
  )

  return userVehicle.vehicle ? (
    <React.Fragment>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography className={classes.title} variant="h6">
            マイバイク初期設定
          </Typography>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <HandleFetch loading={save.isExecuting}>
        <SuccessNotification
          open={success}
          onClose={() => {
            setSuccess(false)
            handleClose()
          }}
          message="更新しました"
        />
        <ErrorNotification task={save} />
        <Container component="main" maxWidth="xs" className={classes.container}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">
                {userVehicle.vehicle.modelName}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <span>
                  以下で設定した稼働時間に対して、練習記録の走行時間が加算されます。
                </span>
                <br />
                <span>
                  新車の場合は0時間0分、中古車などは現在の稼働時間を設定してください。
                </span>
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider />
              <Typography variant="caption" color="textSecondary">
                登録時の稼働時間
              </Typography>
              <Grid container justifyContent="flex-end" spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    name="initialHours"
                    type="number"
                    value={form.initialHours.value}
                    onChange={form.initialHours.setValueFromEvent}
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">時間</InputAdornment>
                      ),
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    name="initialMinutes"
                    type="number"
                    value={form.initialMinutes.value}
                    onChange={form.initialMinutes.setValueFromEvent}
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">分</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
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
            更新
          </Button>
        </Container>
      </HandleFetch>
    </React.Fragment>
  ) : null
}

export default Setting
