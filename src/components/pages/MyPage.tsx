import { AxiosResponse } from 'axios'
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

const MyPage: React.FC = () => {
  const [chartResource, setChartResource] = useState<Resource<
    AxiosResponse<IPracticeRecords>
  > | null>(null)
  const [listResource, setListResource] = useState<Resource<
    AxiosResponse<Models.PracticeRecord[]>
  > | null>(null)
  const reloadResource = () => {
    setChartResource(resources.chart())
    setListResource(resources.list())
  }

  useEffect(() => {
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
