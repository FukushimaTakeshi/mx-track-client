import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiClientWithAuth } from '../../lib/api_client'

const PracticeRecordList = () => {
  const [practiceRecords, setPracticeRecords] = useState([])
  useEffect(() => {
    apiClientWithAuth.get('/practice_records/').then((res) => {
      setPracticeRecords(res.data)
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
