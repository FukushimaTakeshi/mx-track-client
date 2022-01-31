import {
  Alert,
  Backdrop,
  Button,
  FormControl,
  Grid,
  InputLabel,
  Select,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { Form } from '../../hooks/useForm'
import { apiClientWithAuth } from '../../lib/api_client'

type Props = {
  userVehicleForm: Form<Models.UserVehicle>
  setCurrentVehicle: boolean
}

// TODO: Suspenseの実装
const UserVehicleSelect: React.FC<Props> = ({
  userVehicleForm,
  setCurrentVehicle,
}) => {
  const [userVehicles, setUserVehicles] = useState<Models.UserVehicle[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    apiClientWithAuth.get('/user_vehicles/').then((response) => {
      setUserVehicles(response.data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    const fetchCurrentVehicles = () => {
      apiClientWithAuth.get('/current_vehicles').then((response) => {
        const foundUserVehicle = userVehicles.find(
          ({ id }) => id === response.data.id
        )
        foundUserVehicle && userVehicleForm.setValue(foundUserVehicle)
      })
    }
    setCurrentVehicle && userVehicles.length && fetchCurrentVehicles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userVehicles, setCurrentVehicle])

  const HasNotVehicles: React.FC = () => {
    const history = useHistory()
    const handleClickAlert = () => history.push('/vehicles/edit')
    return (
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open
      >
        <Alert
          severity="info"
          action={
            <Button color="inherit" size="small" onClick={handleClickAlert}>
              OK
            </Button>
          }
        >
          はじめにバイクを登録して下さい
        </Alert>
      </Backdrop>
    )
  }

  if (!loading && !userVehicles.length) {
    return <HasNotVehicles />
  }

  return (
    <Grid item xs={12}>
      <FormControl fullWidth>
        <InputLabel shrink required htmlFor="vehicle">
          バイク
        </InputLabel>
        <Select
          native
          variant="outlined"
          label="バイク"
          fullWidth
          required
          value={userVehicleForm.value.id}
          onChange={(e) => userVehicleForm.setValueFromModels(e, userVehicles)}
        >
          {userVehicles.map((userVehicle, i) => (
            <option key={i} value={userVehicle.id}>
              {userVehicle.vehicle.modelName}
            </option>
          ))}
        </Select>
      </FormControl>
    </Grid>
  )
}

export default UserVehicleSelect
