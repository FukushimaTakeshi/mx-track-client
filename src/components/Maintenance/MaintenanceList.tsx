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
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles';
import AddIcon from '@mui/icons-material/Add'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import TimerIcon from '@mui/icons-material/Timer'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { apiClientWithAuth } from '../../lib/api_client'
import { Dashboard } from '../templates/Dashboard'
import Title from '../Title'
import OperationTime from './OperationTime'

const useStyles = makeStyles((theme) => ({
  icon: {
    minWidth: '25px',
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.text.secondary,
  },
  iconButton: {
    padding: 0,
  },
}))

const MaintenanceList: React.FC = () => {
  const classes = useStyles()
  const { userVehicleId } = useParams<{ userVehicleId?: string }>()
  const history = useHistory()
  const [maintenances, setMaintenances] = useState<
    Models.PeriodicMaintenance[]
  >([])
  const [maintenanceTotalTimes, setMaintenanceTotalTimes] = useState<
    Models.UserVehicleTotalTime[]
  >([])
  useEffect(() => {
    apiClientWithAuth
      .get(`/periodic_maintenances/?user_vehicle_id=${userVehicleId}`)
      .then((response) => setMaintenances(response.data))
    apiClientWithAuth
      .get(`/user_vehicles/${userVehicleId}/total_times`)
      .then((response) => setMaintenanceTotalTimes(response.data))
  }, [userVehicleId])

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClickMoreVert = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMoreVert = () => {
    setAnchorEl(null)
  }

  const handleDeleteMaintenance = (maintenanceId: number) => {
    apiClientWithAuth
      .delete(`/periodic_maintenances/${maintenanceId}`)
      .then(() =>
        setMaintenances(maintenances.filter(({ id }) => id !== maintenanceId))
      )
    handleCloseMoreVert()
  }

  return (
    <Dashboard>
      <>
        <Title>定期メンテナンス項目</Title>
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
                <OperationTime
                  maintenance={maintenance}
                  maintenanceTotalTimes={maintenanceTotalTimes}
                />

                <ListItemSecondaryAction>
                  <IconButton
                    className={classes.iconButton}
                    edge="end"
                    aria-label="menu"
                    aria-controls="menu"
                    aria-haspopup="true"
                    onClick={handleClickMoreVert}
                    size="large">
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
      </>
    </Dashboard>
  );
}

export default MaintenanceList
