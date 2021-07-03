import React, { useEffect, useState } from 'react'
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

  useEffect(() => {
    auth.auth().onAuthStateChanged((user) => {
      if (user) {
        verifyUser(user)
      }
    })
  }, [])

  const verifyUser = async (user) => {
    const token = await user.getIdToken(true)
    localStorage.setItem('token', token)
    const config = { token }

    apiClient
      .post('/users', config)
      .then((res) => {
        console.log(res)
        setCurrentUser(res)
        this.$router.push('/')
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <AuthContext.Provider
      value={{
        login,
        signUp,
        currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
