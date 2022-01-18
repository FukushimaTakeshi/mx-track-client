import { Snackbar } from '@mui/material'
import Alert from '@mui/material/Alert'
import React from 'react'

type Props = {
  open: boolean
  onClose?: () => void
  message: string
}

const InformationNotification: React.FC<Props> = ({
  open,
  onClose,
  message,
}) => {
  const handleClose = () => {
    onClose && onClose()
  }

  if (!open) {
    return null
  }

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="info">
        {message}
      </Alert>
    </Snackbar>
  )
}

export default InformationNotification
