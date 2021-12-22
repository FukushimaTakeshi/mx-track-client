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
import UserVehicleSelect from '../Vehicle/UserVehicleSelect'

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

const useMaintenanceForm = () => {
  const maintenanceOn = useForm()
  const maintenanceMenu = useForm({} as Models.MaintenanceMenu)
  const operationHours = useForm<number>()
  const operationMinutes = useForm<number>()
  const memo = useForm()
  const userVehicle = useForm({} as Models.UserVehicle)
  return {
    maintenanceOn,
    maintenanceMenu,
    operationHours,
    operationMinutes,
    memo,
    userVehicle,
  }
}

// TODO: メンテナンス項目を一度に複数登録できるようにする
const MaintenanceForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>()
  const history = useHistory()
  const classes = useStyles()
  const form = useMaintenanceForm()
  const save = useAsyncExecutor(
    () => {
      const params = {
        ...formToObject(form),
        maintenanceMenuId: form.maintenanceMenu.value.id,
        userVehicleId: form.userVehicle.value.id,
      }
      const response = id
        ? apiClientWithAuth.put(`/maintenance_records/${id}`, params)
        : apiClientWithAuth.post('/maintenance_records', params)
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
    })
  }, [])

  useEffect(() => {
    if (id) {
      const fetchMaintenanceRecords = async () => {
        const maintenanceRecords = await apiClientWithAuth.get(
          `/maintenance_records/${id}`
        )
        responseToForm(maintenanceRecords, form)
        const userVehicle = await apiClientWithAuth.get(
          `/user_vehicles/${maintenanceRecords.data.userVehicleId}`
        )
        form.userVehicle.setValue(userVehicle.data)
      }
      fetchMaintenanceRecords()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const [success, setSuccess] = useState(false)

  const handleChangeMaintenanceOn = () => {
    if (!form.maintenanceOn.value || !form.userVehicle.value.id) return

    apiClientWithAuth
      .get(
        `/operation_time/?user_vehicle_id=${form.userVehicle.value.id}&date=${form.maintenanceOn.value}`
      )
      .then((response) => {
        const { hours, minutes } = response.data
        form.operationHours.setValue(hours)
        form.operationMinutes.setValue(minutes)
      })
  }

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
                  <TextField
                    name="maintenanceOn"
                    value={form.maintenanceOn.value}
                    variant="outlined"
                    required
                    fullWidth
                    label="日付"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={form.maintenanceOn.setValueFromEvent}
                    onBlur={handleChangeMaintenanceOn}
                  />
                </Grid>
                <Grid item xs={12}>
                  <MaintenanceMenuSelectBox
                    maintenanceMenuForm={form.maintenanceMenu}
                    maintenanceMenus={maintenanceMenus}
                  />
                </Grid>

                <UserVehicleSelect
                  userVehicle={form.userVehicle}
                  setCurrentVehicle={!id}
                />

                <TimeOrDecimalForm
                  title="メンテナンス時の稼働時間"
                  hours={form.operationHours}
                  minutes={form.operationMinutes}
                  showTotalHours
                />

                <Grid item xs={12}>
                  <TextField
                    name="memo"
                    variant="outlined"
                    fullWidth
                    label="メモ"
                    multiline
                    rows={4}
                    placeholder="メモ"
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
                {id ? '更新' : '登録'}
              </Button>
              <Button
                fullWidth
                variant="contained"
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

export default MaintenanceForm
