import { Snackbar } from '@material-ui/core'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'
import React from 'react'
import { Task } from '../../hooks/useAsyncExecutor'

const Alert: React.FC<AlertProps> = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

type Props = {
  task: Task
}

const ErrorNotification: React.FC<Props> = ({ task }) => {
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
