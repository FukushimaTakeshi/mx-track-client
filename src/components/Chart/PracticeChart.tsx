import { ApexOptions } from 'apexcharts'
import React, { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import { apiClientWithAuth } from '../../lib/api_client'
import HandleFetch from '../Spinner/HandleFetch'
import Title from '../Title'

interface IPracticeRecords {
  numberOfMonthly: Array<{
    yearMonth: string
    count: number
    practiceTime: number
  }>
}

const PracticeChart: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [practiceRecords, setPracticeRecords] = useState({} as IPracticeRecords)
  useEffect(() => {
    setLoading(true)
    apiClientWithAuth
      .get('/practice_records/?sort=+practice_date&field=number_of_monthly')
      .then((res) => {
        setPracticeRecords(res.data)
        setLoading(false)
      })
    // TODO: エラー時
  }, [])

  const { numberOfMonthly } = practiceRecords

  const options: ApexOptions = {
    chart: {
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    stroke: {
      width: [0, 4],
    },
    xaxis: {
      categories: numberOfMonthly
        ? numberOfMonthly.map(({ yearMonth }) => yearMonth)
        : [],
    },
    yaxis: [
      {
        labels: {
          formatter: (val) => String(val),
        },
        title: {
          text: '走行回数',
        },
      },
      {
        opposite: true,
        title: {
          text: '走行時間(h)',
        },
      },
    ],
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1],
    },
  }
  const series = [
    {
      name: '走行回数',
      type: 'column',
      data: numberOfMonthly ? numberOfMonthly.map(({ count }) => count) : [],
    },
    {
      name: '走行時間(h)',
      type: 'line',
      data: numberOfMonthly
        ? numberOfMonthly.map(
            ({ practiceTime }) => Math.round((practiceTime / 60) * 10) / 10 //小数点第1位まで
          )
        : [],
    },
  ]

  return (
    <>
      <Title>my activity</Title>
      <HandleFetch inner loading={loading}>
        <Chart
          options={options}
          series={series}
          type="line"
          width={500}
          height={320}
        />
      </HandleFetch>
    </>
  )
}

export default PracticeChart