import React, { useContext } from 'react'
import { auth } from './auth/auth'
import { AuthContext } from './auth/AuthProvider'

const Home = () => {
  const { currentUser } = useContext(AuthContext)

  return (
    <div>
      {currentUser && currentUser.email}

      <h2>Home Page</h2>
      <button onClick={() => auth.auth().signOut()}>Sign out</button>
    </div>
  )
}

export default Home
