import {
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
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
                      label="メンテナンス項目"
                      labelId="prefecture-label"
                      value={form.prefecture.value}
                      onChange={form.prefecture.setValueFromEvent}
                      renderValue={(value) => (value as Prefecture).name}
                    >
                      {prefectures.map((value) => (
                        <MenuItem
                          key={value.id}
                          // @ts-ignore [2]
                          value={value}
                        >
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
                variant="contained"
                color="default"
                onClick={() => {
                  //
                }}
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

export default TrackForm
