import { Backdrop, CircularProgress } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles';
import React from 'react'

interface Props {
  loading: boolean
}

const Loading: React.FC<Props> = ({ loading, children }) => {
  const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#e6e6e6',
    },
  }))
  const classes = useStyles()

  return (
    <>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {children}
    </>
  )
}

export default Loading
