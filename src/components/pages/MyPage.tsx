import React, { Suspense, useEffect, useState } from 'react'
import { apiClientWithAuth } from '../../lib/api_client'
import { Resource } from '../../lib/resource'
import PracticeChart, { IPracticeRecords } from '../Chart/PracticeChart'
import PracticeRecordList from '../PracticeRecord/PracticeRecordList'
import InnerLoading from '../Spinner/InnerLoading'
import { Dashboard } from '../templates/Dashboard'
import Title from '../Title'

const resources = {
  chart: () =>
    new Resource(() =>
      apiClientWithAuth.get<IPracticeRecords>(
        '/practice_records/?sort=+practice_date&field=number_of_monthly'
      )
    ),
  list: () =>
    new Resource(() =>
      apiClientWithAuth.get<Models.PracticeRecord[]>(
        '/practice_records/?sort=-practice_date'
      )
    ),
}

const initialChartResource = resources.chart()
const initialListResource = resources.list()

const MyPage: React.FC = () => {
  const [chartResource, setChartResource] = useState(initialChartResource)
  const [listResource, setListResource] = useState(initialListResource)
  const reloadResource = () => {
    setChartResource(resources.chart())
    setListResource(resources.list())
  }

  useEffect(() => {
    // FIXME: リロード時などの初期表示時に2回ずつリクエストされてしまう
    reloadResource()
  }, [])

  return (
    <Dashboard>
      <Title>my activity</Title>
      <Suspense fallback={<InnerLoading loading />}>
        <PracticeChart resource={chartResource} />
      </Suspense>
      <Title>activities</Title>
      <Suspense fallback={<InnerLoading loading />}>
        <PracticeRecordList
          resource={listResource}
          reloadResource={reloadResource}
        />
      </Suspense>
    </Dashboard>
  )
}

export default MyPage
