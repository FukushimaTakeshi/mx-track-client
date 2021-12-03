import {
  Button,
  Container,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
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

const useMaintenanceForm = () => {
  const maintenanceOn = useForm()
  const maintenanceMenu = useForm({} as Models.MaintenanceMenu)
  const operationHours = useForm(0)
  const operationMinutes = useForm(0)
  const memo = useForm()
  return {
    maintenanceOn,
    maintenanceMenu,
    operationHours,
    operationMinutes,
    memo,
  }
}

const MaintenanceForm: React.FC = () => {
  const { userVehicleId, id } = useParams<{
    userVehicleId?: string
    id?: string
  }>()
  const history = useHistory()
  const classes = useStyles()
  const form = useMaintenanceForm()
  const save = useAsyncExecutor(
    () => {
      const params = {
        ...formToObject(form),
        maintenanceMenuId: form.maintenanceMenu.value,
        userVehicleId: userVehicleId,
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
      apiClientWithAuth.get(`/maintenance_records/${id}`).then((response) => {
        responseToForm(response, form)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const [success, setSuccess] = useState(false)

  const handleChangeMaintenanceOn = () => {
    if (!form.maintenanceOn.value) return
    apiClientWithAuth
      .get(
        `/operation_time/?user_vehicle_id=${userVehicleId}&date=${form.maintenanceOn.value}`
      )
      .then((response) => {
        const { hours, minutes } = response.data
        form.operationHours.setValue(hours)
        form.operationMinutes.setValue(minutes)
      })
  }

  const handleChangeMaintenanceMenu = (event: SelectChangeEvent<number>) => {
    const selectedMenu = maintenanceMenus.find(
      (maintenanceMenu) => maintenanceMenu.id === Number(event.target.value)
    )
    form.maintenanceMenu.setValue(
      selectedMenu ?? ({} as Models.MaintenanceMenu)
    )
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
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                  >
                    <InputLabel required shrink id="menu-label">
                      メンテナンス項目
                    </InputLabel>
                    <Select
                      native
                      name="maintenanceMenu"
                      label="メンテナンス項目"
                      labelId="menu-label"
                      value={form.maintenanceMenu.value.id}
                      onChange={handleChangeMaintenanceMenu}
                    >
                      {maintenanceMenus.map((value, i) => (
                        <option key={i} value={value.id}>
                          {value.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="caption" color="textSecondary">
                    メンテナンス時の稼働時間
                  </Typography>
                  <Grid container justifyContent="flex-end" spacing={2}>
                    <Grid item xs={5}>
                      <TextField
                        name="operationHours"
                        type="number"
                        value={form.operationHours.value}
                        onChange={form.operationHours.setValueFromEvent}
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
                        name="operationMinutes"
                        type="number"
                        value={form.operationMinutes.value}
                        onChange={form.operationMinutes.setValueFromEvent}
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
