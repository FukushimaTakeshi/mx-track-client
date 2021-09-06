import React, { useContext, useEffect, useState } from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import Loading from '../components/Spinner/Loading'
import { AuthContext } from './AuthProvider'

const PrivateRoute: React.FC<RouteProps> = (props) => {
  const { currentUser, verifyLoginUser } = useContext(AuthContext)

  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      await verifyLoginUser()
      setAuthChecked(true)
    }
    getUser()
  }, [verifyLoginUser])

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
