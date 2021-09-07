import React, { useCallback, useState } from 'react'
import { apiClient } from '../lib/api_client'
import { auth } from './auth'

interface IAuthContext {
  logout: () => void
  verifyLoginUser: () => Promise<void>
  currentUser: Models.User | null
}

export const AuthContext = React.createContext({} as IAuthContext)

export const AuthProvider: React.FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)

  const logout = () => {
    auth.auth().signOut()
    setCurrentUser(null)
    localStorage.removeItem('token')
  }

  const verifyLoginUser = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      auth.auth().onAuthStateChanged(async (user) => {
        if (user) {
          const { displayName, email, photoURL } = user
          const token = await user.getIdToken(true)
          localStorage.setItem('token', token)
          const res = await apiClient.post('/users', {
            token,
            name: displayName,
            email,
            photoURL,
          })
          setCurrentUser(res.data)
        } else {
          setCurrentUser(null)
        }
        // FIXME: なんかへん
        resolve()
      })
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        logout,
        verifyLoginUser,
        currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}