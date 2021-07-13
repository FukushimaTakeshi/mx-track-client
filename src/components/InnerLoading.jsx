import { CircularProgress } from '@material-ui/core'
import React from 'react'

const InnerLoading = ({ loading, children }) => {
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
    children
  )
}

export default InnerLoading
