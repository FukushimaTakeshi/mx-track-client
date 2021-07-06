import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles'
import React, { useContext, useEffect, useState } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { AuthContext } from './AuthProvider'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#e6e6e6',
  },
}))

const PrivateRoute = (props) => {
  const { currentUser, verifyUser } = useContext(AuthContext)

  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      await verifyUser()
      setAuthChecked(true)
    }
    getUser()
  }, [])

  const classes = useStyles()

  return authChecked ? (
    currentUser ? (
      <Route {...props} />
    ) : (
      <Redirect to="/login" />
    )
  ) : (
    <Backdrop className={classes.backdrop} open={true}>
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}

export default PrivateRoute
