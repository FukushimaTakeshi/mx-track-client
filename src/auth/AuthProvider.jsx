import React, { useEffect, useState } from 'react'
import { auth } from './auth'

export const AuthContext = React.createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)

  const login = async (email, password) => {
    await auth.auth().signInWithEmailAndPassword(email, password)
  }

  const signup = async (email, password) => {
    await auth.auth().createUserWithEmailAndPassword(email, password)
  }

  useEffect(() => {
    auth.auth().onAuthStateChanged(setCurrentUser)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        login,
        signup,
        currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
