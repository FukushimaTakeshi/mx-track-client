import { Grid, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import PracticeChart from './Chart/PracticeChart'
import PracticeRecordList from './PracticeRecord/PracticeRecordList'
import { Dashboard } from './templates/Dashboard'

const useStyles = makeStyles(() => ({
  paper: {
    // padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
}))

const MyPage = () => {
  const classes = useStyles()

  return (
    <Dashboard>
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

export default MyPage
