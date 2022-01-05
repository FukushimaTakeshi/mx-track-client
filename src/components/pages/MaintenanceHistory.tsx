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
import { AxiosResponse } from 'axios'
import React, { Suspense, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { apiClientWithAuth } from '../../lib/api_client'
import { Resource } from '../../lib/resource'
import MaintenanceRecord from '../Maintenance/MaintenanceRecord'
import InnerLoading from '../Spinner/InnerLoading'
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

const resources = {
  list: (userVehicleId: string) =>
    new Resource(() =>
      apiClientWithAuth.get<Models.maintenanceRecord[]>(
        `/maintenance_records/?user_vehicle_id=${userVehicleId}&sort=-maintenance_on`
      )
    ),
  vehicle: (userVehicleId: string) =>
    new Resource(() =>
      apiClientWithAuth.get<Models.SettingUserVehicle>(
        `/user_vehicles/${userVehicleId}`
      )
    ),
}

const zeroPadding = (value: number) => String(value).padStart(2, '0')

const MaintenanceHistory: React.FC = () => {
  const classes = useStyles()
  const { userVehicleId } = useParams<{ userVehicleId: string }>()
  const [maintenanceRecords, setMaintenanceRecords] = useState<Resource<
    AxiosResponse<Models.maintenanceRecord[]>
  > | null>(null)
  const [userVehicle, setUserVehicle] = useState<Resource<
    AxiosResponse<Models.SettingUserVehicle>
  > | null>(null)

  const fetchMaintenanceRecords = () =>
    setMaintenanceRecords(resources.list(userVehicleId))

  useEffect(() => {
    fetchMaintenanceRecords()
    setUserVehicle(resources.vehicle(userVehicleId))
  }, [])

  const [detail, setDetail] = useState({} as Models.maintenanceRecord)
  const [showDetail, setShowDetail] = useState(false)
  const handleClickDetail = (
    maintenanceRecords: Models.maintenanceRecord[],
    id: number
  ) => {
    const foundValue = maintenanceRecords.find((record) => record.id === id)
    setDetail(foundValue ?? ({} as Models.maintenanceRecord))
    setShowDetail(true)
  }
  const handleCloseDetail = () => setShowDetail(false)

  const handleDelete = (id: number) => {
    apiClientWithAuth.delete(`/maintenance_records/${id}`)
    fetchMaintenanceRecords()
  }

  type TimeLineMaintenanceItemProps = {
    resource: Resource<AxiosResponse<Models.maintenanceRecord[]>> | null
  }

  const TimeLineMaintenanceItem: React.FC<TimeLineMaintenanceItemProps> = ({
    resource,
  }) => {
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
                handleClickDetail(maintenanceRecords, maintenanceRecord.id)
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

  type TimeLineUserVehicleProps = {
    resource: Resource<AxiosResponse<Models.SettingUserVehicle>> | null
  }

  const TimeLineUserVehicle: React.FC<TimeLineUserVehicleProps> = ({
    resource,
  }) => {
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
          <Suspense fallback={<InnerLoading />}>
            <TimeLineMaintenanceItem resource={maintenanceRecords} />
          </Suspense>
          <Suspense fallback={<InnerLoading />}>
            <TimeLineUserVehicle resource={userVehicle} />
          </Suspense>
        </Timeline>
      </>
    </Dashboard>
  )
}

export default MaintenanceHistory
