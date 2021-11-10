import {
  Autocomplete,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import Restricted from '../../auth/Restricted'
import { useAsyncExecutor } from '../../hooks/useAsyncExecutor'
import { formToObject, useForm } from '../../hooks/useForm'
import { apiClient } from '../../lib/api_client'
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

const useVehicleForm = () => {
  const brand = useForm<Models.Brand>()
  const year = useForm()
  const model = useForm<{
    id?: number
    name: string
  } | null>()
  return { brand, year, model }
}

const range = (start: number, stop: number) =>
  Array.from({ length: stop - start }, (_, i) => start + i)

const VehicleForm: React.FC = () => {
  const classes = useStyles()
  const form = useVehicleForm()
  const history = useHistory()
  const { id } = useParams<{ id?: string }>()
  const [success, setSuccess] = useState(false)
  const save = useAsyncExecutor(
    () => {
      const params = { ...formToObject(form) }
      return apiClient.post('/vehicles', params).then(() => setSuccess(true))
    },
    () => true
  )

  const [brands, setBrands] = useState<Models.Brand[]>([])
  const [models, setModels] = useState<Models.Model[]>([])
  useEffect(() => {
    apiClient.get('/brands').then((response) => setBrands(response.data))
  }, [])

  const handleChangeBrand = (event: SelectChangeEvent) => {
    form.brand.setValueFromEvent(event)
    apiClient
      .get(
        `/models/?brand_id=${
          (event.target.value as unknown as Models.Brand).id
        }`
      )
      .then((response) => setModels(response.data))
  }

  const handleChangeModel = (value: Models.Model | string | null) => {
    if (!value) {
      return form.model.setValue(null)
    }
    if (typeof value === 'string') {
      if (form.model.value) {
        form.model.setValue({ id: form.model.value.id, name: value })
      } else {
        form.model.setValue({ name: value })
      }
    } else {
      const { id, name } = value
      form.model.setValue({ id, name })
    }
  }

  return (
    <Restricted to={'edit-vehicles'}>
      <Dashboard>
        <>
          <Title>オフロードコースの登録</Title>
          <HandleFetch loading={save.isExecuting}>
            <SuccessNotification
              open={success}
              onClose={() => {
                // hoge
              }}
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
                      <InputLabel required>メーカー</InputLabel>
                      <Select
                        label="メーカー"
                        value={form.brand.value.name}
                        onChange={handleChangeBrand}
                      >
                        {brands.map((brand, i) => (
                          <MenuItem key={i} value={brand.id}>
                            {brand.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      className={classes.formControl}
                    >
                      <InputLabel required>年式</InputLabel>
                      <Select
                        label="年式"
                        value={form.year.value}
                        onChange={form.year.setValueFromEvent}
                      >
                        {range(1990, new Date().getFullYear() + 2)
                          .reverse()
                          .map((value) => (
                            <MenuItem key={value} value={value}>
                              {value}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <Autocomplete
                      freeSolo
                      options={models}
                      getOptionLabel={(option) => option.name}
                      onChange={(e, value) => handleChangeModel(value)}
                      onInputChange={(e, value) => handleChangeModel(value)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="車両"
                          required
                          variant="outlined"
                        />
                      )}
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
    </Restricted>
  )
}

export default VehicleForm
