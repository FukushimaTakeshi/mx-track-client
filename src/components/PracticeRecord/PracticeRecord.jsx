import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { apiClient } from '../../lib/api_client'

const PracticeRecord = () => {
  const [record, setRecord] = useState({})
  const { id } = useParams()

  useEffect(() => {
    const token = localStorage.getItem('token')
    apiClient
      .get(`/practice_records/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setRecord(res.data)
      })
  }, [id])

  return (
    <>
      {record.id}
      {record.practice_date}
      {record.hours}
      {record.minutes}
      {record.memo}
    </>
  )
}

export default PracticeRecord
