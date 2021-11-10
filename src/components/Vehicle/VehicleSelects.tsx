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
} from '@mui/material'
import { green } from '@mui/material/colors'
import makeStyles from '@mui/styles/makeStyles';
import CheckIcon from '@mui/icons-material/Check'
import DeleteIcon from '@mui/icons-material/Delete'
import Autocomplete from '@mui/material/Autocomplete'
import React, { useEffect, useState } from 'react'
import { useSelectVehicle } from '../../hooks/Vehicle/useSelectVehicle'
import { apiClientWithAuth } from '../../lib/api_client'
import { Dashboard } from '../templates/Dashboard'
import Title from '../Title'
import Setting from './Setting'

interface ISetting {
  show: boolean
  vehicle?: Models.UserVehicle
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
  const { state, handle } = useSelectVehicle()
  const classes = useStyles()
  const [myVehicles, setMyVehicles] = useState<Models.UserVehicle[]>([])
  const [currentVehicleId, setCurrentVehicleId] = useState(0)

  useEffect(() => {
    apiClientWithAuth.get('/user_vehicles').then((response) => {
      setMyVehicles(response.data)
    })
    apiClientWithAuth.get('/current_vehicles').then((response) => {
      setCurrentVehicleId(response.data.id)
    })
  }, [])

  const handleSubmit = async () => {
    const response = await apiClientWithAuth.post('/user_vehicles', {
      vehicleId: state.selectedVehicle.id,
    })
    setMyVehicles([
      ...myVehicles,
      {
        id: response.data.id,
        vehicle: {
          modelName: `${state.selectedBrand.name}  ${state.selectedVehicle.modelName} ${state.selectedYear}`,
        },
      },
    ])
    handle.resetState()
  }

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const handleShowDialog = () => setShowDeleteDialog(true)
  const handleCloseDialog = () => setShowDeleteDialog(false)

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentVehicleId = Number(event.target.value)
    setCurrentVehicleId(currentVehicleId)
    apiClientWithAuth.post('/current_vehicles', {
      userVehicleId: currentVehicleId,
    })
  }

  const handleDelete = (id: number) => {
    const filteredVehicles = myVehicles.filter(
      (myVehicle) => myVehicle.id !== id
    )
    setMyVehicles([...filteredVehicles])
    apiClientWithAuth.delete(`/user_vehicles/${id}`)
    handleCloseDialog()
  }

  const [setting, setSetting] = useState({} as ISetting)
  const handleOpenSetting = (vehicle: Models.UserVehicle) => {
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
                            {myVehicle.vehicle.modelName}
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
                      <IconButton onClick={handleShowDialog} size="large">
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
            blurOnSelect
            onOpen={handle.fetchBrands}
            options={state.brands}
            getOptionLabel={(option) => option.name}
            onChange={(e, brand) => handle.changeBrand(brand)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="メーカー"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: state.selectedBrand.id && <SelectedIcon />,
                }}
              />
            )}
          />
          <Autocomplete
            key={state.selectedBrand.id}
            disablePortal
            disableClearable
            blurOnSelect
            options={state.years}
            getOptionLabel={(option) => String(option)}
            disabled={!state.years.length}
            onChange={(e, year) => handle.changeYear(year)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="年式"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: state.selectedYear && <SelectedIcon />,
                }}
              />
            )}
          />
          <Autocomplete
            key={`${state.selectedBrand.id}-${state.selectedYear}`}
            disablePortal
            disableClearable
            blurOnSelect
            options={state.vehicles}
            getOptionLabel={(option) => option.modelName}
            disabled={!state.vehicles.length}
            onChange={(e, vehicle) => handle.changeVehicle(vehicle)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="車両"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: state.selectedVehicle.id && <SelectedIcon />,
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
            disabled={!state.selectedVehicle.id}
          >
            登録
          </Button>
        </Container>
      </>
    </Dashboard>
  );
}

export default VehicleSelects
