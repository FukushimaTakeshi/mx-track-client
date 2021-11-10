import { Grid, Paper } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles';
import React from 'react'
import { Dashboard } from './components/templates/Dashboard'

const useStyles = makeStyles(() => ({
  paper: {
    // padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
}))

const Home: React.FC = () => {
  const classes = useStyles()

  return (
    <Dashboard>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <Paper elevation={0} className={classes.paper}>
            あああああああ
          </Paper>
        </Grid>
      </Grid>
    </Dashboard>
  )
}

export default Home
