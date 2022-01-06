import { Dialog } from '@mui/material'
import { AxiosResponse } from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { apiClientWithAuth } from '../../lib/api_client'
import { Resource } from '../../lib/resource'
import MaintenanceRecord from '../Maintenance/MaintenanceRecord'
import MaintenanceTimeline from '../Maintenance/MaintenanceTimeline'
import { Dashboard } from '../templates/Dashboard'

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

const MaintenanceHistory: React.FC = () => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  return (
    <Dashboard>
      <>
        <Dialog open={showDetail} onClose={handleCloseDetail} fullWidth>
          <MaintenanceRecord
            {...detail}
            onDelete={fetchMaintenanceRecords}
            onClose={handleCloseDetail}
          />
        </Dialog>
        <MaintenanceTimeline
          maintenanceRecords={maintenanceRecords}
          resource={userVehicle}
          onClickDetail={handleClickDetail}
        />
      </>
    </Dashboard>
  )
}

export default MaintenanceHistory
