import React, { useCallback, useState } from 'react'
import { useHistory } from 'react-router'
import { apiClient, apiClientWithAuth } from '../lib/api_client'
import { auth } from './auth'

interface IAuthContext {
  logout: () => void
  verifyLoginUser: () => Promise<void>
  currentUser: Models.User | null
  userRole: Models.UserRole | null
}

export const AuthContext = React.createContext({} as IAuthContext)

export const AuthProvider: React.FC = ({ children }) => {
  const history = useHistory()
  const [currentUser, setCurrentUser] = useState(null)
  const [userRole, setUserRole] = useState(null)

  const logout = async () => {
    window.location.href = '/'
    await auth.auth().signOut()
    setCurrentUser(null)
    setUserRole(null)
    localStorage.removeItem('token')
  }

  const verifyLoginUser = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      auth.auth().onAuthStateChanged(async (user) => {
        if (user && (!currentUser || !userRole)) {
          const token = localStorage.getItem('token')
          try {
            const user = await apiClient.get('/users', { params: { token } })
            setCurrentUser(user.data)
            const roles = await apiClientWithAuth.get('/roles')
            setUserRole(roles.data)
          } catch (error) {
            setCurrentUser(null)
            setUserRole(null)
            alert('認証に失敗しました。もう一度ログインして下さい。')
            history.push('/login')
          }
        } else {
          setCurrentUser(null)
          setUserRole(null)
        }
        // FIXME: なんかへん
        resolve()
      })
    })
  }, [currentUser, userRole, history])

  return (
    <AuthContext.Provider
      value={{
        logout,
        verifyLoginUser,
        currentUser,
        userRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
