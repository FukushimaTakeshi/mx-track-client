import { Button, Container, Grid, TextField } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { useAsyncExecutor } from '../../hooks/useAsyncExecutor'
import { formToObject, responseToForm, useForm } from '../../hooks/useForm'
import { apiClient, apiClientWithAuth } from '../../lib/api_client'
import MaintenanceMenuSelectBox from '../Maintenance/MaintenanceMenuSelectBox'
import ErrorNotification from '../Notification/ErrorNotification'
import SuccessNotification from '../Notification/SuccessNotification'
import HandleFetch from '../Spinner/HandleFetch'
import { Dashboard } from '../templates/Dashboard'
import TimeOrDecimalForm from '../Time/TimeOrDecimalForm'
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
  const menu = useForm({} as Models.MaintenanceMenu)
  const cycleHours = useForm(0)
  const cycleMinutes = useForm(0)
  const memo = useForm()
  return { menu, cycleHours, cycleMinutes, memo }
}

const PeriodicMaintenanceForm: React.FC = () => {
  const { userVehicleId, id } = useParams<{
    userVehicleId?: string
    id?: string
  }>()
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

  const [maintenanceMenus, setMaintenanceMenus] = useState<
    Models.MaintenanceMenu[]
  >([])

  useEffect(() => {
    apiClient.get('/maintenance_menus').then((response) => {
      setMaintenanceMenus(response.data)
      if (!id) {
        form.menu.setValue(response.data[0])
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (id) {
      apiClientWithAuth.get(`/periodic_maintenances/${id}`).then((response) => {
        responseToForm(response, form)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                  <MaintenanceMenuSelectBox
                    maintenanceMenuForm={form.menu}
                    maintenanceMenus={maintenanceMenus}
                  />
                </Grid>

                <TimeOrDecimalForm
                  title={'整備期間'}
                  hours={form.cycleHours}
                  minutes={form.cycleMinutes}
                />

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
                variant="outlined"
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
