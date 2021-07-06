import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from '../../lib/api_client'

const PracticeRecordList = () => {
  const [practiceRecords, setPracticeRecords] = useState([])
  useEffect(() => {
    const token = localStorage.getItem('token')

    apiClient
      .get('/practice_records/', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setPracticeRecords(res.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  return (
    <>
      {practiceRecords.map((record) => (
        <Link key={record.id} to={`practice_records/${record.id}`}>
          <div>
            {record.id}
            {record.practice_date}
            {record.hours}
            {record.minutes}
            {record.memo}
            {record.user_id}
          </div>
        </Link>
      ))}
    </>
  )
}

export default PracticeRecordList
