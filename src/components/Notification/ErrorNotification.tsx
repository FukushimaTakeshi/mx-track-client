import { Snackbar } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'
import React from 'react'

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

const ErrorNotification = ({ task }) => {
  const discardError = () => task.setError('')

  if (!task.error) {
    return null
  }

  return (
    <Snackbar
      open={!!task.error}
      autoHideDuration={6000}
      onClose={discardError}
    >
      <Alert onClose={discardError} severity="error">
        {task.error}
      </Alert>
    </Snackbar>
  )
}

export default ErrorNotification
