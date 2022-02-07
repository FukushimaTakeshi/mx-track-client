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

  const dates = Array.from(
    new Set(maintenanceRecords.map((record) => record.maintenanceOn))
  )
  const records = dates.map((date) => {
    const records = maintenanceRecords.filter(
      (record) => record.maintenanceOn === date
    )
    return { date: date, maintenanceRecords: records }
  })

  return (
    <>
      {records.map((maintenanceRecord) => (
        <TimelineItem key={maintenanceRecord.date}>
          <TimelineOppositeContent className={classes.oppositeContent}>
            <Typography variant="caption" color="textSecondary">
              {maintenanceRecord.date}
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot>
              <BuildIcon fontSize="small" />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>

          <span className={classes.timelineContent}>
            <TimelineContent>
              <Paper elevation={2} className={classes.paper}>
                {maintenanceRecord.maintenanceRecords.map((record, index) => (
                  <React.Fragment key={index}>
                    {index === 0 ? (
                      <Typography variant="subtitle2" color="textSecondary">
                        {`${record.operationHours}:${zeroPadding(
                          record.operationMinutes
                        )}`}
                      </Typography>
                    ) : null}

                    <Typography
                      variant="subtitle1"
                      onClick={() =>
                        onClickDetail(maintenanceRecords, record.id)
                      }
                    >
                      {record.maintenanceMenu.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      style={{ whiteSpace: 'pre-line' }}
                    >
                      {record.memo}
                    </Typography>
                  </React.Fragment>
                ))}
              </Paper>
            </TimelineContent>
          </span>
        </TimelineItem>
      ))}
    </>
  )
}

export default MaintenanceItem
