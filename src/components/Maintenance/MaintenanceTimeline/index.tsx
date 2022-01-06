import { Timeline } from '@mui/lab'
import { makeStyles } from '@mui/styles'
import { AxiosResponse } from 'axios'
import React, { Suspense } from 'react'
import { Resource } from '../../../lib/resource'
import InnerLoading from '../../Spinner/InnerLoading'
import MaintenanceItem from './MaintenanceItems'
import UserVehicle from './UserVehicle'

const useStyles = makeStyles(() => ({
  timeline: {
    padding: 1,
  },
}))

type Props = {
  maintenanceRecords: Resource<AxiosResponse<Models.maintenanceRecord[]>> | null
  resource: Resource<AxiosResponse<Models.SettingUserVehicle>> | null
  onClickDetail(
    maintenanceRecords: Models.maintenanceRecord[],
    id: number
  ): void
}

const MaintenanceTimeline: React.FC<Props> = ({
  maintenanceRecords,
  resource,
  onClickDetail,
}) => {
  const classes = useStyles()
  return (
    <Timeline className={classes.timeline}>
      <Suspense fallback={<InnerLoading />}>
        <MaintenanceItem
          resource={maintenanceRecords}
          onClickDetail={onClickDetail}
        />
      </Suspense>
      <Suspense fallback={<InnerLoading />}>
        <UserVehicle resource={resource} />
      </Suspense>
    </Timeline>
  )
}

export default MaintenanceTimeline
