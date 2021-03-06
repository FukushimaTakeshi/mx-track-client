import { CircularProgress } from '@mui/material'
import React from 'react'

type Props = {
  loading?: boolean
}

const InnerLoading: React.FC<Props> = ({ loading = true, children }) => {
  return loading ? (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '1.6em',
        color: '#e6e6e6',
      }}
    >
      <CircularProgress color="inherit" />
    </div>
  ) : (
    <>{children}</>
  )
}

export default InnerLoading
