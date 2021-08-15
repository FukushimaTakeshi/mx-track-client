import { Typography } from '@material-ui/core'
import React from 'react'

const zeroPadding = (value) => String(value).padStart(2, '0')

const OperationTime = ({ maintenance, maintenanceTotalTimes }) => {
  const findTotalTime = () => {
    const foundValue = maintenanceTotalTimes.find(
      (time) => time.maintenanceMenuId === maintenance.maintenanceMenu.id
    )
    return foundValue ?? {}
  }

  const isOperationTimeMoreThan = () => {
    const totalOperationTime = findTotalTime()
    const operationTime =
      totalOperationTime.totalOperationHours * 60 +
      totalOperationTime.totalOperationMinutes
    const cycleTime = maintenance.cycleHours * 60 + maintenance.cycleMinutes

    return operationTime >= cycleTime
  }

  const totalOperationTime = findTotalTime()
  const isExceeding = isOperationTimeMoreThan()

  return (
    <>
      <Typography
        variant={isExceeding ? 'body1' : 'subtitle2'}
        color={isExceeding ? 'secondary' : 'initial'}
      >
        {`${totalOperationTime.totalOperationHours}:${zeroPadding(
          totalOperationTime.totalOperationMinutes
        )}`}
      </Typography>
      <Typography variant="subtitle2">
        {`/ ${maintenance.cycleHours}:${zeroPadding(maintenance.cycleMinutes)}`}
      </Typography>
    </>
  )
}

export default OperationTime
