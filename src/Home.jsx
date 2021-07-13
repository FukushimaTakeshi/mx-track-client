import { Grid, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React, { useContext } from 'react'
import { AuthContext } from './auth/AuthProvider'
import PracticeChart from './components/Chart/PracticeChart'
import PracticeRecordList from './components/PracticeRecord/PracticeRecordList'
import { Dashboard } from './components/templates/Dashboard'

const useStyles = makeStyles(() => ({
  paper: {
    // padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
}))

const Home = () => {
  const { logout } = useContext(AuthContext)

  const classes = useStyles()

  return (
    <Dashboard>
      <h2>Home Page</h2>
      <button onClick={logout}>Sign out</button>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <Paper elevation={0} className={classes.paper}>
            <PracticeChart />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={0} className={classes.paper}>
            <PracticeRecordList />
          </Paper>
        </Grid>
      </Grid>
    </Dashboard>
  )
}

export default Home
