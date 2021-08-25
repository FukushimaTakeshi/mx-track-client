import React, { useContext, useEffect, useState } from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import Loading from '../components/Spinner/Loading'
import { AuthContext } from './AuthProvider'

const PrivateRoute: React.FunctionComponent<RouteProps> = (props) => {
  const { currentUser, verifyUser } = useContext(AuthContext)

  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      await verifyUser()
      setAuthChecked(true)
    }
    getUser()
  }, [verifyUser])

  return authChecked ? (
    currentUser ? (
      <Route {...props} />
    ) : (
      <Redirect to="/" />
    )
  ) : (
    <Loading loading={!authChecked} />
  )
}

export default PrivateRoute
