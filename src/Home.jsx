import React, { useContext } from 'react'
import { AuthContext } from './auth/AuthProvider'
import PracticeChart from './components/Chart/PracticeChart'
import PracticeRecordList from './components/PracticeRecord/PracticeRecordList'
import { Dashboard } from './components/templates/Dashboard'

const Home = () => {
  const { logout } = useContext(AuthContext)

  return (
    <Dashboard>
      <h2>Home Page</h2>
      <button onClick={logout}>Sign out</button>

      <PracticeChart />
      <PracticeRecordList />
    </Dashboard>
  )
}

export default Home
