import React, { useEffect, useState } from 'react'
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
    auth.auth().onAuthStateChanged(setCurrentUser)
  }, [])

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
