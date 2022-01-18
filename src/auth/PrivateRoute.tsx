import React, { useContext, useEffect, useState } from 'react'
import { Route, RouteProps, useHistory } from 'react-router-dom'
import InformationNotification from '../components/Notification/InformationNotification'
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

  const Notification = () => {
    const history = useHistory()
    return (
      <InformationNotification
        open={true}
        onClose={() => history.push('/login')}
        message={'ログインして下さい'}
      />
    )
  }

  return authChecked ? (
    currentUser ? (
      <Route {...props} />
    ) : (
      <Notification />
    )
  ) : (
    <Loading loading={!authChecked} />
  )
}

export default PrivateRoute
