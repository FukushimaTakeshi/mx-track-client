import React, { useContext } from 'react'
import { auth } from './auth/auth'
import { AuthContext } from './auth/AuthProvider'
import { Dashboard } from './components/templates/Dashboard'

const Home = () => {
  const { currentUser } = useContext(AuthContext)

  return (
    <Dashboard>
      <div>
        {currentUser && currentUser.email}

        <h2>Home Page</h2>
        <button onClick={() => auth.auth().signOut()}>Sign out</button>
      </div>
    </Dashboard>
  )
}

export default Home
