import React, { useContext } from 'react'
import { auth } from './auth/auth'
import { AuthContext } from './auth/AuthProvider'
import PracticeRecordForm from './components/PracticeRecordForm'
import { Dashboard } from './components/templates/Dashboard'

const Home = () => {
  const { currentUser } = useContext(AuthContext)

  return (
    <Dashboard>
      <div>
        {currentUser && currentUser.email}

        <h2>Home Page</h2>
        <button onClick={() => auth.auth().signOut()}>Sign out</button>
        <PracticeRecordForm />
      </div>
    </Dashboard>
  )
}

export default Home
