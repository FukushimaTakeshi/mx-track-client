import { Snackbar } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import React from 'react'

const SuccessNotification = ({ open, onClose, message }) => {
  const handleClose = () => {
    onClose && onClose()
  }

  if (!open) {
    return null
  }

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="success">
        {message}
      </Alert>
    </Snackbar>
  )
}

export default SuccessNotification
