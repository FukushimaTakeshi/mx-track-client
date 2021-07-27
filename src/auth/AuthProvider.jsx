import React, { useState } from 'react'
import { apiClient } from '../lib/api_client'
import { auth } from './auth'

export const AuthContext = React.createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)

  const logout = () => {
    auth.auth().signOut()
    setCurrentUser(null)
    localStorage.removeItem('token')
  }

  // TODO: エラー処理
  const verifyUser = () => {
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
        }
        // FIXME: なんかへん
        resolve()
      })
    })
  }

  return (
    <AuthContext.Provider
      value={{
        logout,
        verifyUser,
        currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
