import {
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import Restricted from '../../auth/Restricted'
import { useAsyncExecutor } from '../../hooks/useAsyncExecutor'
import { formToObject, responseToForm, useForm } from '../../hooks/useForm'
import { apiClient } from '../../lib/api_client'
import ErrorNotification from '../Notification/ErrorNotification'
import SuccessNotification from '../Notification/SuccessNotification'
import HandleFetch from '../Spinner/HandleFetch'
import { Dashboard } from '../templates/Dashboard'
import Title from '../Title'

type Prefecture = Pick<Models.Prefecture, 'id' | 'name'>

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

const useTrackForm = () => {
  const name = useForm()
  const prefecture = useForm({} as Prefecture)
  return { name, prefecture }
}

const TrackForm: React.FC = () => {
  const history = useHistory()
  const { id } = useParams<{ id?: string }>()
  const form = useTrackForm()
  const classes = useStyles()
  const [prefectures, setPrefectures] = useState<Prefecture[]>([])
  useEffect(
    () => {
      if (id) {
        apiClient
          .get(`/off_road_tracks/${id}`)
          .then((response) => responseToForm(response, form))
      }
      apiClient
        .get('/prefectures')
        .then((response) => setPrefectures(response.data))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const [success, setSuccess] = useState(false)
  const save = useAsyncExecutor(
    () => {
      const params = {
        ...formToObject(form),
        prefectureId: form.prefecture.value.id,
      }
      const response = id
        ? apiClient.put(`/off_road_tracks/${id}`, params)
        : apiClient.post('/off_road_tracks', params)
      return response.then(() => setSuccess(true))
    },
    () => true
  )

  return (
    <Restricted to={'edit-off-road-tracks'}>
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
                      <InputLabel id="prefecture-label">都道府県</InputLabel>
                      <Select
                        name="prefecture"
                        labelId="prefecture-label"
                        value={form.prefecture.value.id}
                        onChange={(e) =>
                          form.prefecture.setValueFromModels(e, prefectures)
                        }
                      >
                        {prefectures.map((value, i) => (
                          <MenuItem key={i} value={value.id}>
                            {value.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      name="name"
                      variant="outlined"
                      fullWidth
                      label="コース名"
                      value={form.name.value}
                      onChange={form.name.setValueFromEvent}
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
    </Restricted>
  )
}

export default TrackForm
