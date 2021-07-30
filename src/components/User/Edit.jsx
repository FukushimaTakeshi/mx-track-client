import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  TextField,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../../auth/AuthProvider'
import { apiClientWithAuth } from '../../lib/api_client'
import { Dashboard } from '../templates/Dashboard'
import Title from '../Title'
import VehicleSelects from '../Vehicle/VehicleSelects'

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

const Edit = () => {
  const classes = useStyles()
  const { currentUser } = useContext(AuthContext)
  const [user, setUser] = useState(currentUser)
  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value })
  }
  const handleSubmit = () => {
    apiClientWithAuth.put(`/users/${user.id}`, { ...user })
  }

  return (
    <Dashboard>
      <>
        <Title>アカウント</Title>
        <Container component="main" maxWidth="xs">
          <Box pb={3}>
            <Avatar
              alt="Remy Sharp"
              src={user.photoUrl}
              className={classes.avatar}
            />
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                name="name"
                label="名前"
                fullWidth
                variant="outlined"
                autoComplete="given-name"
                value={user.name}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
          >
            更新
          </Button>
        </Container>
      </>
      <VehicleSelects />
    </Dashboard>
  )
}

export default Edit
