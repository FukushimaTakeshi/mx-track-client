import React, { Suspense } from 'react'
import { apiClientWithAuth } from '../lib/api_client'
import { Resource } from '../lib/resource'
import PracticeChart, { IPracticeRecords } from './Chart/PracticeChart'
import PracticeRecordList from './PracticeRecord/PracticeRecordList'
import InnerLoading from './Spinner/InnerLoading'
import { Dashboard } from './templates/Dashboard'
import Title from './Title'

const resource = new Resource(() =>
  apiClientWithAuth.get<IPracticeRecords>(
    '/practice_records/?sort=+practice_date&field=number_of_monthly'
  )
)

const MyPage: React.FC = () => {
  return (
    <Dashboard>
      <Title>my activity</Title>
      <Suspense fallback={<InnerLoading loading />}>
        <PracticeChart resource={resource} />
      </Suspense>
      <PracticeRecordList />
    </Dashboard>
  )
}

export default MyPage
