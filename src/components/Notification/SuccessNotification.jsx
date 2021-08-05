import { Snackbar, SnackbarContent } from '@material-ui/core'
import { green } from '@material-ui/core/colors'
import { makeStyles } from '@material-ui/core/styles'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import React, { useState } from 'react'

const useStyles = makeStyles((theme) => ({
  success: {
    backgroundColor: green[600],
  },

  icon: {
    fontSize: 20,
  },
  iconVariant: {
    fontSize: 20,
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}))

const SuccessNotification = (props) => {
  const classes = useStyles()
  const [open, setOpen] = useState(props.open)

  const handleClose = () => {
    setOpen(false)
    props.onClose && props.onClose()
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <SnackbarContent
        className={classes.success}
        aria-describedby="client-snackbar"
        message={
          <span id="client-snackbar" className={classes.message}>
            <CheckCircleIcon className={classes.iconVariant} />
            {props.message}
          </span>
        }
      />
    </Snackbar>
  )
}

export default SuccessNotification
