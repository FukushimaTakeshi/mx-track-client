import CloseIcon from '@mui/icons-material/Close'
import {
  AppBar,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import React, { useEffect, useState } from 'react'
import { useAsyncExecutor } from '../../hooks/useAsyncExecutor'
import { useForm } from '../../hooks/useForm'
import { apiClientWithAuth } from '../../lib/api_client'
import ErrorNotification from '../Notification/ErrorNotification'
import SuccessNotification from '../Notification/SuccessNotification'
import HandleFetch from '../Spinner/HandleFetch'
import TimeOrDecimalForm from '../Time/TimeOrDecimalForm'

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
  const initialHours = useForm<number>()
  const initialMinutes = useForm<number>()
  return { initialHours, initialMinutes }
}

// TODO: バイク登録時に初期時間の設定画面にリダイレクトする
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
            size="large"
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
                  新車の場合は0時間0分のまま、中古車などは現在の稼働時間を設定してください。
                </span>
                <br />
                <p>
                  アワーメーターなどで管理していない場合はだいたいの時間を設定してください。
                  <br />
                  例: 1回の練習で1h、ひと月4回のペースで1年間練習していた場合
                  <br />
                  1h × 4回 × 12ヶ月 ＝ 登録時の稼働時間: 48h
                </p>
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider />
              <TimeOrDecimalForm
                title="登録時の稼働時間"
                hours={form.initialHours}
                minutes={form.initialMinutes}
                maximumHours={300}
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
            更新
          </Button>
          <Button variant="outlined" fullWidth onClick={handleClose}>
            戻る
          </Button>
        </Container>
      </HandleFetch>
    </React.Fragment>
  ) : null
}

export default Setting
