import { FormControl, Grid, InputLabel, Select } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Form } from '../../hooks/useForm'
import { apiClientWithAuth } from '../../lib/api_client'

type Props = {
  userVehicle: Form<Models.UserVehicle>
  setCurrentVehicle: boolean
}

const UserVehicleSelect: React.FC<Props> = ({
  userVehicle,
  setCurrentVehicle,
}) => {
  const [userVehicles, setUserVehicles] = useState<Models.UserVehicle[]>([])

  useEffect(() => {
    apiClientWithAuth
      .get('/user_vehicles/')
      .then((response) => setUserVehicles(response.data))
  }, [])

  useEffect(() => {
    const fetchCurrentVehicles = () => {
      apiClientWithAuth.get('/current_vehicles').then((response) => {
        const foundUserVehicle = userVehicles.find(
          ({ id }) => id === response.data.id
        )
        foundUserVehicle && userVehicle.setValue(foundUserVehicle)
      })
    }
    setCurrentVehicle && userVehicles.length && fetchCurrentVehicles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userVehicles, setCurrentVehicle])

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
          value={userVehicle.value.id}
          onChange={(e) => userVehicle.setValueFromModels(e, userVehicles)}
          inputProps={{
            id: 'vehicle',
          }}
        >
          {userVehicles.map((userVehicle) => (
            <option key={userVehicle.id} value={userVehicle.id}>
              {userVehicle.vehicle.modelName}
            </option>
          ))}
        </Select>
      </FormControl>
    </Grid>
  )
}

export default UserVehicleSelect
