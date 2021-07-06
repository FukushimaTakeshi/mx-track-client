import React, { useState } from 'react'
import { apiClient } from '../lib/api_client'
import { auth } from './auth'

export const AuthContext = React.createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)

  const login = async (email, password) => {
    await auth.auth().signInWithEmailAndPassword(email, password)
  }

  const signUp = async (email, password) => {
    await auth.auth().createUserWithEmailAndPassword(email, password)
  }

  const logout = () => {
    auth.auth().signOut()
    setCurrentUser(null)
    localStorage.removeItem('token')
  }

  const verifyUser = () => {
    return new Promise((resolve) => {
      auth.auth().onAuthStateChanged(async (user) => {
        if (user) {
          const token = await user.getIdToken(true)
          localStorage.setItem('token', token)
          const res = await apiClient.post('/users', { token })
          setCurrentUser(res)
        }
        resolve()
      })
    })
  }

  return (
    <AuthContext.Provider
      value={{
        login,
        signUp,
        logout,
        verifyUser,
        currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
