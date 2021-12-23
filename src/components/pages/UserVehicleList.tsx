import AddIcon from '@mui/icons-material/Add'
import BuildIcon from '@mui/icons-material/Build'
import {
  Button,
  Container,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { AxiosResponse } from 'axios'
import React, { Suspense, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { apiClientWithAuth } from '../../lib/api_client'
import { Resource } from '../../lib/resource'
import InnerLoading from '../Spinner/InnerLoading'
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

const resource = () =>
  new Resource(() => apiClientWithAuth.get('/user_vehicles/'))

const UserVehicleList: React.FC = () => {
  const classes = useStyles()
  const query = useQuery()

  const [userVehicleResource, setUserVehicleResource] = useState<Resource<
    AxiosResponse<Models.UserVehicle[]>
  > | null>(null)

  useEffect(() => {
    setUserVehicleResource(resource())
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

  type UserVehicleListProps = {
    resource: Resource<AxiosResponse<Models.UserVehicle[]>> | null
  }

  const UserVehicleList: React.FC<UserVehicleListProps> = ({ resource }) => {
    const userVehicles = resource?.read().data

    return (
      <List>
        {userVehicles &&
          (!userVehicles.length ? (
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
          ))}
      </List>
    )
  }

  return (
    <Dashboard>
      <>
        <Title>バイクを選択してください</Title>
        <Container component="main" maxWidth="xs">
          <Suspense fallback={<InnerLoading />}>
            <UserVehicleList resource={userVehicleResource} />
          </Suspense>
        </Container>
      </>
    </Dashboard>
  )
}

export default UserVehicleList
