import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  TextField,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React, { useContext } from 'react'
import { AuthContext } from '../../auth/AuthProvider'
import { useAsyncExecutor } from '../../hooks/useAsyncExecutor'
import { useForm } from '../../hooks/useForm'
import { apiClientWithAuth } from '../../lib/api_client'
import ErrorNotification from '../Notification/ErrorNotification'
import { Dashboard } from '../templates/Dashboard'
import Title from '../Title'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

const useUserForm = (user) => {
  const name = useForm(user.name)
  return { name }
}

const Edit = () => {
  const classes = useStyles()
  const { currentUser } = useContext(AuthContext)
  const form = useUserForm(currentUser)
  const validator = () => {
    // TODO: validate
    return true
  }

  // FIXME: 名前を更新してもリロードしないと表示が変わらない
  const save = useAsyncExecutor(() => {
    if (!currentUser) {
      return new Promise(() => {})
    }
    const params = { name: form.name.value }
    return apiClientWithAuth.put(`/users/${currentUser.id}`, params)
  }, validator)

  return (
    <Dashboard>
      <>
        <Title>アカウント</Title>
        <Container component="main" maxWidth="xs">
          <Box pb={3}>
            <Avatar src={currentUser?.photoUrl} className={classes.avatar} />
          </Box>
          <ErrorNotification task={save} />
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                name="name"
                label="名前"
                fullWidth
                variant="outlined"
                autoComplete="given-name"
                value={form.name.value}
                onChange={form.name.setValueFromEvent}
                error={!!form.name.error}
                helperText={form.name.error}
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
            更新
          </Button>
        </Container>
      </>
    </Dashboard>
  )
}

export default Edit
