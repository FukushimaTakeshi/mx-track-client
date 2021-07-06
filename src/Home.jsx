import React, { useContext } from 'react'
import { AuthContext } from './auth/AuthProvider'
import Form from './components/PracticeRecord/Form'
import PracticeRecordList from './components/PracticeRecord/PracticeRecordList'
import { Dashboard } from './components/templates/Dashboard'

const Home = () => {
  const { currentUser, logout } = useContext(AuthContext)

  return (
    <Dashboard>
      <div>
        {currentUser && <>OK</>}

        <h2>Home Page</h2>
        <button onClick={logout}>Sign out</button>
        <Form />
        <PracticeRecordList />
      </div>
    </Dashboard>
  )
}

export default Home
