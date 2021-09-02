import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
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
import { Dashboard } from '../templates/Dashboard'
import Title from '../Title'
import Setting from './Setting'

interface IVehicle {
  id: number
  year: number
  modelName: string
}
interface IMyVehicle {
  id: number
  vehicle: {
    name: string
  }
}

interface ISetting {
  show: boolean
  vehicle?: IVehicle
}

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    // margin: theme.spacing(2),
    width: '270px',
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

const VehicleSelects: React.FC = () => {
  const classes = useStyles()
  const [brands, setBrands] = useState<Models.Brand[]>([])
  const [years, setYears] = useState([])
  const [vehicles, setVehicles] = useState<IVehicle[]>([])
  const [selectedBrand, setSelectedBrand] = useState({} as Models.Brand)
  const [selectedYear, setSelectedYear] = useState(null)
  const [selectedVehicle, setSelectedVehicle] = useState({} as IVehicle)
  const [myVehicles, setMyVehicles] = useState<IMyVehicle[]>([])
  const [currentVehicleId, setCurrentVehicleId] = useState(0)

  useEffect(() => {
    apiClientWithAuth.get('/user_vehicles').then((response) => {
      setMyVehicles(response.data)
    })
    apiClientWithAuth.get('/current_vehicles').then((response) => {
      setCurrentVehicleId(response.data.id)
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
    setSelectedBrand(brand)
    setSelectedYear(null)
    setSelectedVehicle({} as IVehicle)
    apiClient.get(`/brands/${brand.id}`).then((response) => {
      setYears(response.data.years)
    })
  }

  const handleChangeYear = (event, year) => {
    setSelectedYear(year)
    setSelectedVehicle({} as IVehicle)
    // setSelected({ brand: selected.brand, year: selectedYear })
    apiClient
      .get(`/vehicles/?year=${year}&brand_id=${selectedBrand.id}`)
      .then((response) => {
        setVehicles(response.data)
      })
  }

  const handleChangeVehicle = (event, vehicle) => {
    setSelectedVehicle(vehicle)
  }

  const handleSubmit = async () => {
    const response = await apiClientWithAuth.post('/user_vehicles', {
      vehicleId: selectedVehicle.id,
    })
    setMyVehicles([
      ...myVehicles,
      {
        id: response.data.id,
        vehicle: {
          name: `${selectedBrand.name}  ${selectedVehicle.modelName} ${selectedYear}`,
        },
      },
    ])

    setSelectedBrand({} as Models.Brand)
    setSelectedYear(null)
    setSelectedVehicle({} as IVehicle)
  }

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const handleShowDialog = () => setShowDeleteDialog(true)
  const handleCloseDialog = () => setShowDeleteDialog(false)

  const handleRadioChange = (event) => {
    const currentVehicleId = Number(event.target.value)
    setCurrentVehicleId(currentVehicleId)
    apiClientWithAuth.post('/current_vehicles', {
      userVehicleId: currentVehicleId,
    })
  }

  const handleDelete = (id) => {
    const filteredVehicles = myVehicles.filter(
      (myVehicle) => myVehicle.id !== id
    )
    setMyVehicles([...filteredVehicles])
    apiClientWithAuth.delete(`/user_vehicles/${id}`)
    handleCloseDialog()
  }

  const [setting, setSetting] = useState({} as ISetting)
  const handleOpenSetting = (vehicle) => {
    setSetting({ show: true, vehicle })
  }
  const handleCloseSetting = () => {
    setSetting({ show: false })
  }

  return (
    <Dashboard>
      <>
        <Title>マイバイク</Title>
        <Container component="main" maxWidth="xs">
          {!!myVehicles.length && (
            <RadioGroup value={currentVehicleId} onChange={handleRadioChange}>
              {myVehicles.map((myVehicle) => (
                <React.Fragment key={myVehicle.id}>
                  <Grid container className={classes.gridContainer}>
                    <FormControlLabel
                      value={myVehicle.id}
                      control={<Radio />}
                      label={
                        <Grid item xs={12}>
                          <Typography
                            component="span"
                            variant="subtitle1"
                            gutterBottom
                            color={
                              myVehicle.id === currentVehicleId
                                ? 'initial'
                                : 'textSecondary'
                            }
                          >
                            {myVehicle.vehicle.name}
                          </Typography>
                        </Grid>
                      }
                    />
                  </Grid>
                  <Grid container justifyContent="flex-end" spacing={0}>
                    <Grid item>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="primary"
                        onClick={() => handleOpenSetting(myVehicle)}
                      >
                        稼働時間を設定
                      </Button>
                    </Grid>
                    <Grid item>
                      <IconButton onClick={handleShowDialog}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Grid>
                  </Grid>

                  <Dialog
                    open={
                      !!setting.show && setting?.vehicle?.id === myVehicle.id
                    }
                    onClose={handleCloseSetting}
                    fullScreen
                  >
                    <Setting
                      id={myVehicle.id}
                      onClose={() => setSetting({ show: false })}
                    />
                  </Dialog>

                  <Dialog open={showDeleteDialog} onClose={handleCloseDialog}>
                    <DialogTitle>{'削除してもよろしいですか？'}</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        削除すると、該当バイクで登録した練習記録がすべて無効になります。
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseDialog} color="primary">
                        キャンセル
                      </Button>
                      <Button
                        onClick={() => handleDelete(myVehicle.id)}
                        color="primary"
                        autoFocus
                      >
                        削除
                      </Button>
                    </DialogActions>
                  </Dialog>
                </React.Fragment>
              ))}
            </RadioGroup>
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
                  startAdornment: selectedBrand.id && <SelectedIcon />,
                }}
              />
            )}
          />
          <Autocomplete
            key={selectedBrand.id}
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
                  startAdornment: selectedYear && <SelectedIcon />,
                }}
              />
            )}
          />
          <Autocomplete
            key={`${selectedBrand.id}-${selectedYear}`}
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
                  startAdornment: selectedVehicle.id && <SelectedIcon />,
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
            disabled={!selectedVehicle.id}
          >
            登録
          </Button>
        </Container>
      </>
    </Dashboard>
  )
}

export default VehicleSelects
