import {
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import TimerIcon from '@material-ui/icons/Timer'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { apiClientWithAuth } from '../../lib/api_client'
import { Dashboard } from '../templates/Dashboard'
import Title from '../Title'

const useStyles = makeStyles((theme) => ({
  icon: {
    minWidth: '25px',
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.text.secondary,
  },
}))

const MaintenanceList = () => {
  const classes = useStyles()
  const { userVehicleId } = useParams()
  const history = useHistory()
  const [maintenances, setMaintenances] = useState([])
  const [maintenanceTotalTimes, setMaintenanceTotalTimes] = useState([])
  useEffect(() => {
    apiClientWithAuth
      .get(`/periodic_maintenances/?user_vehicle_id=${userVehicleId}`)
      .then((response) => setMaintenances(response.data))
    apiClientWithAuth
      .get(`/user_vehicles/${userVehicleId}/total_times`)
      .then((response) => setMaintenanceTotalTimes(response.data))
  }, [userVehicleId])

  const [anchorEl, setAnchorEl] = useState(null)

  const handleClickMoreVert = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMoreVert = () => {
    setAnchorEl(null)
  }

  const handleDeleteMaintenance = (maintenanceId) => {
    apiClientWithAuth
      .delete(`/periodic_maintenances/${maintenanceId}`)
      .then(() =>
        setMaintenances(maintenances.filter(({ id }) => id !== maintenanceId))
      )
    handleCloseMoreVert()
  }

  const findTotalTime = (maintenanceMenuId) =>
    maintenanceTotalTimes.find((o) => o.maintenanceMenuId === maintenanceMenuId)

  const zeroPadding = (value) => String(value).padStart(2, '0')

  return (
    <Dashboard>
      <>
        <Title>メンテナンス</Title>
        <List>
          {maintenances.map((maintenance) => (
            <React.Fragment key={maintenance.id}>
              <ListItem
                disableGutters
                button
                onClick={() => history.push(`maintenances/${maintenance.id}`)}
              >
                <ListItemIcon className={classes.icon}>
                  <TimerIcon />
                </ListItemIcon>
                <ListItemText>
                  <Typography variant="subtitle2">
                    {maintenance.maintenanceMenu.name}
                  </Typography>
                </ListItemText>
                <Typography variant="subtitle2">
                  {`${
                    findTotalTime(maintenance.maintenanceMenu.id)
                      ?.totalOperationHours
                  }:${zeroPadding(
                    findTotalTime(maintenance.maintenanceMenu.id)
                      ?.totalOperationMinutes
                  )}`}
                  {` / ${maintenance.cycleHours}:${zeroPadding(
                    maintenance.cycleMinutes
                  )}`}
                </Typography>
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="menu"
                    aria-controls="menu"
                    aria-haspopup="true"
                    onClick={handleClickMoreVert}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMoreVert}
                  >
                    <MenuItem onClick={handleCloseMoreVert}>
                      経過時間のリセット
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleDeleteMaintenance(maintenance.id)}
                    >
                      削除
                    </MenuItem>
                  </Menu>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
          <Link to={'maintenances/new'} className={classes.link}>
            <ListItem button>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                startIcon={<AddIcon />}
              >
                <Typography variant="subtitle1">
                  メンテナンス項目の追加
                </Typography>
              </Button>
            </ListItem>
          </Link>
        </List>
        <Link to={'maintenances/records'}>履歴</Link>
        <Link to={'maintenance_records/new'}>新規作成</Link>
      </>
    </Dashboard>
  )
}

export default MaintenanceList
