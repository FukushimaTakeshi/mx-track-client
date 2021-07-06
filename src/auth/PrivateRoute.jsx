import React, { useContext, useEffect, useState } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { AuthContext } from './AuthProvider'

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

  return authChecked ? (
    currentUser ? (
      <Route {...props} />
    ) : (
      <Redirect to="/login" />
    )
  ) : (
    <>ログイン処理中!!!</>
  )
}

export default PrivateRoute
