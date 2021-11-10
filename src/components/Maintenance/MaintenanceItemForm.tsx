import { Button, Container, Grid, TextField } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React, { useState } from 'react'
import { useHistory } from 'react-router'
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

const useTrackForm = () => {
  const name = useForm()
  return { name }
}

const MaintenanceItemForm: React.FC = () => {
  const history = useHistory()
  const form = useTrackForm()
  const classes = useStyles()

  const [success, setSuccess] = useState(false)
  const save = useAsyncExecutor(
    () => {
      const params = { ...formToObject(form) }
      return apiClient
        .post('/maintenance_menus', params)
        .then(() => setSuccess(true))
    },
    () => true
  )

  return (
    <Restricted to={'edit-maintenance-menus'}>
      <Dashboard>
        <>
          <Title>メンテナンス項目の登録</Title>
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
                      name="name"
                      variant="outlined"
                      fullWidth
                      label="メンテナンス項目名"
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
                  登録
                </Button>
                <Button fullWidth variant="contained" onClick={() => history.goBack()}>
                  戻る
                </Button>
              </div>
            </Container>
          </HandleFetch>
        </>
      </Dashboard>
    </Restricted>
  );
}

export default MaintenanceItemForm
