declare namespace Models {
  type Vehicle = {
    modelName: string
  }

  type Brand = {
    id: number
    name: string
  }

  type PracticeRecord = {
    id: number
    practiceDate: string
    hours: number
    minutes: number
    memo: string
    offRoadTrack: OffRoadTrack
    userVehicle: UserVehicle
  }

  type CurrentVehicle = {
    id: number
    vehicle: Vehicle
  }

  type OperationTime = {
    hours: number
    minutes: number
  }

  type OffRoadTrack = {
    id: number
    name: string
  }

  type Prefecture = {
    id: number
    name: string
    offRoadTracks: OffRoadTrack[]
  }

  type Region = {
    id: number
    name: string
    prefectures: Prefecture[]
  }

  type MaintenanceMenu = {
    id: number
    name: string
  }

  type maintenanceRecord = {
    id: number
    maintenanceOn: string
    operationHours: number
    operationMinutes: number
    memo: string
    maintenanceMenu: MaintenanceMenu
    vehicle: Vehicle
  }

  type UserVehicle = {
    id: number
    vehicle: Vehicle
  }

  type SettingUserVehicle = Models.UserVehicle & {
    initialHours: number
    initialMinutes: number
    createdDate: string
  }

  type periodicMaintenance = {
    id: number
    maintenanceMenu: MaintenanceMenu
    cycleHours: number
    cycleMinutes: number
    memo: string
  }

  type userVehicleTotalTime = {
    maintenanceMenuId: number
    totalOperationHours: number
    totalOperationMinutes: number
  }
}
