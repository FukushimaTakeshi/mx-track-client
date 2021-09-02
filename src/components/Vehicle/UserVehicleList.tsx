import {
  Button,
  Container,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import BuildIcon from '@material-ui/icons/Build'
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { apiClientWithAuth } from '../../lib/api_client'
import { Dashboard } from '../templates/Dashboard'
import Title from '../Title'

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
  },
}))

const useQuery = () => {
  return new URLSearchParams(useLocation().search)
}

const UserVehicleList: React.FC = () => {
  const classes = useStyles()
  const query = useQuery()
  const [userVehicles, setUserVehicles] = useState<Models.UserVehicle[]>([])

  useEffect(() => {
    apiClientWithAuth.get('/user_vehicles').then((response) => {
      setUserVehicles(response.data)
    })
  }, [])

  const url = () => {
    switch (query.get('to')) {
      case 'maintenance-records':
        return 'maintenances/history'
      case 'practice-record':
        return 'maintenance_records/new'
      case 'periodic-maintenance':
        return 'maintenances'
    }
  }

  return (
    <Dashboard>
      <>
        <Title>バイクを選択してください</Title>
        <Container component="main" maxWidth="xs">
          <List>
            {!userVehicles.length ? (
              <Link className={classes.link} to="/vehicles/edit">
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  startIcon={<AddIcon />}
                >
                  <Typography variant="subtitle1">バイクを登録</Typography>
                </Button>
              </Link>
            ) : (
              userVehicles.map((userVehicle) => (
                <Link
                  className={classes.link}
                  key={userVehicle.id}
                  to={`/vehicles/${userVehicle.id}/${url()}`}
                >
                  <ListItem button>
                    <ListItemIcon>
                      <BuildIcon />
                    </ListItemIcon>
                    <ListItemText primary={userVehicle.vehicle.modelName} />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </Link>
              ))
            )}
          </List>
        </Container>
      </>
    </Dashboard>
  )
}

export default UserVehicleList
