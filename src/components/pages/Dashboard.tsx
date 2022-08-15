import { AxiosResponse } from 'axios'
import React, { Suspense, useEffect, useState } from 'react'
import { apiClientWithAuth } from '../../lib/api_client'
import { Resource } from '../../lib/resource'
import PracticeChart, { IPracticeRecords } from '../Chart/PracticeChart'
import InformationNotification from '../Notification/InformationNotification'
import PracticeRecordList from '../PracticeRecord/PracticeRecordList'
import InnerLoading from '../Spinner/InnerLoading'
import { Dashboard as TemplateDashboard } from '../templates/Dashboard'
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

const Dashboard: React.FC = () => {
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

  const [showInformation, setShowInformation] = useState(false)

  useEffect(() => {
    reloadResource()

    // TODO: もう少し汎用的にする & 外部からメッセージを設定可能にする
    const information = localStorage.getItem('information')
    if (!information || JSON.parse(information)) {
      setShowInformation(true)
      localStorage.setItem('information', 'false')
    }
  }, [])

  return (
    <TemplateDashboard>
      <InformationNotification
        open={showInformation}
        onClose={() => setShowInformation(false)}
        message={'整備記録の登録時に発生していたエラーを修正しました'}
      />
      <Title>My Activity</Title>
      <Suspense fallback={<InnerLoading />}>
        <PracticeChart resource={chartResource} />
      </Suspense>
      <Title>走行履歴一覧</Title>
      <Suspense fallback={<InnerLoading />}>
        <PracticeRecordList
          resource={listResource}
          reloadResource={reloadResource}
        />
      </Suspense>
    </TemplateDashboard>
  )
}

export default Dashboard
