import { getAuth, onAuthStateChanged } from 'firebase/auth'
import React, { useCallback, useState } from 'react'
import { apiClient, apiClientWithAuth } from '../lib/api_client'
import { firebaseApp } from './auth'

interface IAuthContext {
  logout: () => void
  verifyLoginUser: () => Promise<void>
  currentUser: Models.User | null
  userRole: Models.UserRole | null
}

export const AuthContext = React.createContext({} as IAuthContext)

export const AuthProvider: React.FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [userRole, setUserRole] = useState(null)

  const auth = getAuth(firebaseApp)

  const logout = async () => {
    window.location.href = '/'
    await auth.signOut()
    setCurrentUser(null)
    setUserRole(null)
    localStorage.removeItem('auth-token')
  }

  const verifyLoginUser = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (user) => {
        if (user && (!currentUser || !userRole)) {
          const token = localStorage.getItem('auth-token')
          const idToken = token ? JSON.parse(token).idToken : ''

          try {
            const user = await apiClient.get('/users', {
              params: { token: idToken },
            })
            setCurrentUser(user.data)
            const roles = await apiClientWithAuth.get('/roles')
            setUserRole(roles.data)
          } catch (error) {
            setCurrentUser(null)
            setUserRole(null)
            alert('認証に失敗しました。もう一度ログインして下さい。')
            window.location.href = '/login'
          }
        } else {
          setCurrentUser(null)
          setUserRole(null)
        }
        // FIXME: なんかへん
        resolve()
      })
    })
  }, [auth, currentUser, userRole])

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
