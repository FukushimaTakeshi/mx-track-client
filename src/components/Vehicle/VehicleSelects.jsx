import {
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@material-ui/core'
import { green } from '@material-ui/core/colors'
import { makeStyles } from '@material-ui/core/styles'
import CheckIcon from '@material-ui/icons/Check'
import DeleteIcon from '@material-ui/icons/Delete'
import Autocomplete from '@material-ui/lab/Autocomplete'
import React, { useEffect, useState } from 'react'
import { apiClient, apiClientWithAuth } from '../../lib/api_client'
import Title from '../Title'

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    margin: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

const SelectedIcon = () => (
  <InputAdornment position="start">
    <CheckIcon fontSize="small" style={{ color: green[500] }} />
  </InputAdornment>
)

const VehicleSelects = () => {
  const classes = useStyles()
  const [brands, setBrands] = useState([])
  const [years, setYears] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [selected, setSelected] = useState({ brand: {} })
  const [myVehicles, setMyVehicles] = useState([])

  useEffect(() => {
    apiClientWithAuth.get('/user_vehicles').then((response) => {
      setMyVehicles(response.data)
    })
  }, [])

  const handleFetchBrands = () => {
    apiClient.get('/brands').then((response) => {
      setBrands(response.data)
    })
  }

  const handleChangeBrand = (event, brand) => {
    setYears([])
    setVehicles([])
    setSelected({ brand })
    apiClient.get(`/brands/${brand.id}`).then((response) => {
      setYears(response.data.years)
    })
  }

  const handleChangeYear = (event, year) => {
    setSelected({ brand: selected.brand, year: year })
    apiClient
      .get(`/vehicles/?year=${year}&brand_id=${selected.brand.id}`)
      .then((response) => {
        setVehicles(response.data)
      })
  }

  const handleChangeVehicle = (event, vehicle) => {
    setSelected({ ...selected, vehicle })
  }

  const handleSubmit = async () => {
    const response = await apiClientWithAuth.post('/user_vehicles', {
      vehicleId: selected.vehicle.id,
    })
    setMyVehicles([
      ...myVehicles,
      {
        id: response.data.id,
        vehicle: {
          name: `${selected.brand.name}  ${selected.vehicle.modelName} ${selected.year}`,
        },
      },
    ])

    setSelected({ brand: {} })
  }

  const handleDelete = (id) => {
    const filteredVehicles = myVehicles.filter(
      (myVehicle) => myVehicle.id !== id
    )
    setMyVehicles([...filteredVehicles])
    apiClientWithAuth.delete(`/user_vehicles/${id}`)
  }

  return (
    <>
      <Title>マイバイク</Title>
      <Container component="main" maxWidth="xs">
        {!!myVehicles.length && (
          <Grid container spacing={0} className={classes.gridContainer}>
            {myVehicles.map((myVehicle) => (
              <Grid item xs={12} key={myVehicle.id}>
                <Typography component="span" variant="body1" gutterBottom>
                  {myVehicle.vehicle.name}
                </Typography>
                <IconButton onClick={() => handleDelete(myVehicle.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Grid>
            ))}
          </Grid>
        )}
        <Divider />
        <Typography variant="subtitle2" color="textSecondary">
          自分のバイクを登録すると、稼働時間を記録できます。
        </Typography>
        <Autocomplete
          // see. https://stackoverflow.com/questions/59790956/material-ui-autocomplete-clear-value
          key={myVehicles.length}
          disablePortal
          disableClearable
          onOpen={handleFetchBrands}
          options={brands}
          getOptionLabel={(option) => option.name}
          onChange={handleChangeBrand}
          renderInput={(params) => (
            <TextField
              {...params}
              label="メーカー"
              InputProps={{
                ...params.InputProps,
                startAdornment: selected.brand.id && <SelectedIcon />,
              }}
            />
          )}
        />
        <Autocomplete
          key={selected.brand.id}
          disablePortal
          disableClearable
          options={years}
          getOptionLabel={(option) => String(option)}
          disabled={!years.length}
          onChange={handleChangeYear}
          renderInput={(params) => (
            <TextField
              {...params}
              label="年式"
              InputProps={{
                ...params.InputProps,
                startAdornment: selected.year && <SelectedIcon />,
              }}
            />
          )}
        />
        <Autocomplete
          key={`${selected.brand.id}-${selected.year}`}
          disablePortal
          disableClearable
          options={vehicles}
          getOptionLabel={(option) => option.modelName}
          disabled={!vehicles.length}
          onChange={handleChangeVehicle}
          renderInput={(params) => (
            <TextField
              {...params}
              label="車両"
              InputProps={{
                ...params.InputProps,
                startAdornment: selected.vehicle && <SelectedIcon />,
              }}
            />
          )}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={handleSubmit}
          disabled={!selected.vehicle}
        >
          登録
        </Button>
      </Container>
    </>
  )
}

export default VehicleSelects
