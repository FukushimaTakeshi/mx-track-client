import {
  Button,
  Container,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { useAsyncExecutor } from '../../hooks/useAsyncExecutor'
import { formToObject, responseToForm, useForm } from '../../hooks/useForm'
import { apiClient, apiClientWithAuth } from '../../lib/api_client'
import ErrorNotification from '../Notification/ErrorNotification'
import SuccessNotification from '../Notification/SuccessNotification'
import HandleFetch from '../Spinner/HandleFetch'
import { Dashboard } from '../templates/Dashboard'
import Title from '../Title'

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  formControl: {
    minWidth: '100%',
  },
}))

const usePeriodicMaintenanceForm = () => {
  const menu = useForm()
  const cycleHours = useForm(0)
  const cycleMinutes = useForm(0)
  const memo = useForm()
  return { menu, cycleHours, cycleMinutes, memo }
}

const PeriodicMaintenanceForm = () => {
  const { userVehicleId, id } = useParams()
  const history = useHistory()
  const classes = useStyles()
  const form = usePeriodicMaintenanceForm()
  const save = useAsyncExecutor(
    () => {
      const params = {
        ...formToObject(form),
        maintenanceMenuId: form.menu.value.id,
        userVehicleId: userVehicleId,
      }
      const response = id
        ? apiClientWithAuth.put(`/periodic_maintenances/${id}`, params)
        : apiClientWithAuth.post('/periodic_maintenances', params)
      return response.then(() => setSuccess(true))
    },
    () => true
  )

  const [maintenanceMenus, setMaintenanceMenus] = useState([])

  useEffect(() => {
    apiClient.get('/maintenance_menus').then((response) => {
      setMaintenanceMenus(response.data)
    })
  }, [])

  useEffect(() => {
    if (id) {
      apiClientWithAuth.get(`/periodic_maintenances/${id}`).then((response) => {
        responseToForm(response, form)
      })
    }
  }, [id])

  const [success, setSuccess] = useState(false)

  return (
    <Dashboard>
      <>
        <Title>メンテナンス内容の登録</Title>
        <HandleFetch loading={save.isExecuting}>
          <SuccessNotification
            open={success}
            onClose={() => history.goBack()}
            message="更新しました"
          />
          <ErrorNotification task={save} />

          <Container>
            <div className={classes.form}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                  >
                    <InputLabel id="menu-label">メンテナンス項目</InputLabel>
                    <Select
                      name="menu"
                      label="メンテナンス項目"
                      labelId="menu-label"
                      value={form.menu.value}
                      onChange={form.menu.setValueFromEvent}
                      renderValue={(value) => value.name}
                    >
                      {maintenanceMenus.map((value) => (
                        <MenuItem key={value.id} value={value}>
                          {value.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="caption" color="textSecondary">
                    整備期間
                  </Typography>
                  <Grid container justifyContent="flex-end" spacing={2}>
                    <Grid item xs={4}>
                      <TextField
                        name="cycleHours"
                        type="number"
                        value={form.cycleHours.value}
                        onChange={form.cycleHours.setValueFromEvent}
                        variant="outlined"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">時間</InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        name="cycleMinutes"
                        type="number"
                        value={form.cycleMinutes.value}
                        onChange={form.cycleMinutes.setValueFromEvent}
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

                <Grid item xs={12}>
                  <TextField
                    name="memo"
                    variant="outlined"
                    fullWidth
                    label="メモ"
                    multiline
                    rows={4}
                    placeholder="オイル量などのメモ"
                    value={form.memo.value}
                    onChange={form.memo.setValueFromEvent}
                    InputLabelProps={{ shrink: true }}
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
              <Button
                fullWidth
                variant="contained"
                color="default"
                onClick={() => history.goBack()}
              >
                戻る
              </Button>
            </div>
          </Container>
        </HandleFetch>
      </>
    </Dashboard>
  )
}

export default PeriodicMaintenanceForm
