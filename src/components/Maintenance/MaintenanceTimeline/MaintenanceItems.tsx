import BuildIcon from '@mui/icons-material/Build'
import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab'
import { Paper, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AxiosResponse } from 'axios'
import React from 'react'
import { Resource } from '../../../lib/resource'

const useStyles = makeStyles(() => ({
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

const zeroPadding = (value: number) => String(value).padStart(2, '0')

type Props = {
  resource: Resource<AxiosResponse<Models.maintenanceRecord[]>> | null
  onClickDetail(
    maintenanceRecords: Models.maintenanceRecord[],
    id: number
  ): void
}

const MaintenanceItem: React.FC<Props> = ({ resource, onClickDetail }) => {
  const classes = useStyles()
  const maintenanceRecords = resource?.read().data
  if (!maintenanceRecords) {
    return null
  }

  return (
    <>
      {maintenanceRecords.map((maintenanceRecord) => (
        <TimelineItem key={maintenanceRecord.id}>
          <TimelineOppositeContent className={classes.oppositeContent}>
            <Typography variant="caption" color="textSecondary">
              {maintenanceRecord.maintenanceOn}
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot>
              <BuildIcon fontSize="small" />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <span
            className={classes.timelineContent}
            onClick={() =>
              onClickDetail(maintenanceRecords, maintenanceRecord.id)
            }
          >
            <TimelineContent>
              <Typography variant="subtitle2" color="textSecondary">
                {`${maintenanceRecord.operationHours}:${zeroPadding(
                  maintenanceRecord.operationMinutes
                )}`}
              </Typography>
              <Paper elevation={2} className={classes.paper}>
                <Typography variant="subtitle1">
                  {maintenanceRecord.maintenanceMenu.name}
                </Typography>
                <Typography
                  variant="caption"
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {maintenanceRecord.memo}
                </Typography>
              </Paper>
            </TimelineContent>
          </span>
        </TimelineItem>
      ))}
    </>
  )
}

export default MaintenanceItem
