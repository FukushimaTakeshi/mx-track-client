import { ApexOptions } from 'apexcharts'
import { AxiosResponse } from 'axios'
import React from 'react'
import Chart from 'react-apexcharts'
import { Resource } from '../../lib/resource'

export interface IPracticeRecords {
  numberOfMonthly: Array<{
    yearMonth: string
    count: number
    practiceTime: number
  }>
}

type Props = {
  resource: Resource<AxiosResponse<IPracticeRecords>>
}

const PracticeChart: React.FC<Props> = ({ resource }) => {
  const practiceRecords = resource.read().data
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
    <Chart
      options={options}
      series={series}
      type="line"
      width={500}
      height={320}
    />
  )
}

export default PracticeChart
