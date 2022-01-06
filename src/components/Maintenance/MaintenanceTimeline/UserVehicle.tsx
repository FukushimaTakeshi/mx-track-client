import CheckIcon from '@mui/icons-material/Check'
import {
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab'
import { Typography } from '@mui/material'
import { green } from '@mui/material/colors'
import { makeStyles } from '@mui/styles'
import { AxiosResponse } from 'axios'
import React from 'react'
import { Resource } from '../../../lib/resource'

const useStyles = makeStyles(() => ({
  timeline: {
    padding: 1,
  },
  oppositeContent: {
    flexGrow: 0.5,
    padding: '1px 10px',
  },
  timelineContent: {
    flexGrow: 2,
  },
  paper: {
    padding: '6px 16px',
  },
}))

type Props = {
  resource: Resource<AxiosResponse<Models.SettingUserVehicle>> | null
}

const UserVehicle: React.FC<Props> = ({ resource }) => {
  const classes = useStyles()
  const userVehicle = resource?.read().data

  if (!userVehicle) {
    return null
  }

  return (
    <TimelineItem>
      <TimelineOppositeContent className={classes.oppositeContent}>
        <Typography variant="caption" color="textSecondary">
          {userVehicle.createdDate}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot variant="outlined">
          <CheckIcon fontSize="small" style={{ color: green[500] }} />
        </TimelineDot>
      </TimelineSeparator>
      <TimelineContent className={classes.timelineContent}>
        <Typography variant="caption">
          {`${userVehicle.vehicle.modelName} の`}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          管理を開始しました！
        </Typography>
      </TimelineContent>
    </TimelineItem>
  )
}

export default UserVehicle
