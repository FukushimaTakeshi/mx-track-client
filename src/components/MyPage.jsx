import React from 'react'
import PracticeChart from './Chart/PracticeChart'
import PracticeRecordList from './PracticeRecord/PracticeRecordList'
import { Dashboard } from './templates/Dashboard'

const MyPage = () => {
  return (
    <Dashboard>
      <PracticeChart />
      <PracticeRecordList />
    </Dashboard>
  )
}

export default MyPage
