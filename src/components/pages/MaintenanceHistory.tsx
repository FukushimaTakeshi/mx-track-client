import BuildIcon from '@mui/icons-material/Build'
import CheckIcon from '@mui/icons-material/Check'
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab'
import { Dialog, Paper, Typography } from '@mui/material'
import { green } from '@mui/material/colors'
import makeStyles from '@mui/styles/makeStyles'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { apiClientWithAuth } from '../../lib/api_client'
import MaintenanceRecord from '../Maintenance/MaintenanceRecord'
import { Dashboard } from '../templates/Dashboard'

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

const MaintenanceHistory: React.FC = () => {
  const classes = useStyles()
  const { userVehicleId } = useParams<{ userVehicleId?: string }>()
  const [maintenanceRecords, setMaintenanceRecords] = useState<
    Array<Models.maintenanceRecord>
  >([])
  const [vehicle, setVehicle] = useState({} as Models.SettingUserVehicle)

  const fetchMaintenanceRecords = useCallback(() => {
    apiClientWithAuth
      .get(
        `/maintenance_records/?user_vehicle_id=${userVehicleId}&sort=-maintenance_on`
      )
      .then((response) => setMaintenanceRecords(response.data))
  }, [userVehicleId])

  useEffect(() => {
    fetchMaintenanceRecords()
    apiClientWithAuth
      .get(`/user_vehicles/${userVehicleId}`)
      .then((response) => setVehicle(response.data))
  }, [fetchMaintenanceRecords, userVehicleId])

  const [detail, setDetail] = useState({} as Models.maintenanceRecord)
  const [showDetail, setShowDetail] = useState(false)
  const handleClickDetail = (id: number) => {
    const foundValue = maintenanceRecords.find((record) => record.id === id)
    setDetail(foundValue ?? ({} as Models.maintenanceRecord))
    setShowDetail(true)
  }
  const handleCloseDetail = () => setShowDetail(false)

  const handleDelete = (id: number) => {
    apiClientWithAuth.delete(`/maintenance_records/${id}`)
    fetchMaintenanceRecords()
  }

  const zeroPadding = (value: number) => String(value).padStart(2, '0')

  return (
    <Dashboard>
      <>
        <Dialog open={showDetail} onClose={handleCloseDetail} fullWidth>
          <MaintenanceRecord
            {...detail}
            onDelete={() => handleDelete(detail.id)}
            onClose={handleCloseDetail}
          />
        </Dialog>
        <Timeline className={classes.timeline}>
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
                onClick={() => handleClickDetail(maintenanceRecord.id)}
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
          <TimelineItem>
            <TimelineOppositeContent className={classes.oppositeContent}>
              <Typography variant="caption" color="textSecondary">
                {vehicle.createdDate}
              </Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot variant="outlined">
                <CheckIcon fontSize="small" style={{ color: green[500] }} />
              </TimelineDot>
            </TimelineSeparator>
            <TimelineContent className={classes.timelineContent}>
              <Typography variant="caption">
                {`${vehicle.vehicle?.modelName} の`}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                管理を開始しました！
              </Typography>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </>
    </Dashboard>
  )
}

export default MaintenanceHistory
