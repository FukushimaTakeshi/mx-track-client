import { Typography } from '@material-ui/core'
import React from 'react'

const Title = ({ children }) => {
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {children}
    </Typography>
  )
}

export default Title
