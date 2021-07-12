import React, { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import { apiClientWithAuth } from '../../lib/api_client'

const PracticeChart = () => {
  const [practiceRecords, setPracticeRecords] = useState({})
  useEffect(() => {
    apiClientWithAuth
      .get('/practice_records/?sort=+practice_date&field=number_of_monthly')
      .then((res) => {
        setPracticeRecords(res.data)
      })
  }, [])

  const { numberOfMonthly } = practiceRecords

  const options = {
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
          formatter: (val) => Number(val),
        },
        title: {
          text: '走行回数',
        },
      },
      {
        opposite: true,
        labels: {
          formatter: (val) => Math.floor(val),
        },
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
            ({ practiceTime }) => Math.round((practiceTime / 60) * 10) / 10
          )
        : [],
    },
  ]

  return (
    <>
      <Chart
        options={options}
        series={series}
        type="line"
        width={500}
        height={320}
      />
    </>
  )
}

export default PracticeChart
