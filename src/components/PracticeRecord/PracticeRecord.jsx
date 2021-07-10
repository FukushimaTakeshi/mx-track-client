import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { apiClientWithAuth } from '../../lib/api_client'

const PracticeRecord = () => {
  const [record, setRecord] = useState({})
  const { id } = useParams()

  useEffect(() => {
    apiClientWithAuth.get(`/practice_records/${id}`).then((res) => {
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
