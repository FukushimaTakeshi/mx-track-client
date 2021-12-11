import {
  createTheme,
  StyledEngineProvider,
  Theme,
  ThemeProvider,
} from '@mui/material/styles'
import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './auth/AuthProvider'
import Login from './auth/Login'
import PrivateRoute from './auth/PrivateRoute'
import MaintenanceForm from './components/Maintenance/MaintenanceForm'
import MaintenanceHistory from './components/Maintenance/MaintenanceHistory'
import MaintenanceItemForm from './components/Maintenance/MaintenanceItemForm'
import MaintenanceItemList from './components/Maintenance/MaintenanceItemList'
import MaintenanceList from './components/Maintenance/MaintenanceList'
import PeriodicMaintenanceForm from './components/Maintenance/PeriodicMaintenanceForm'
import MyPage from './components/MyPage'
import Form from './components/PracticeRecord/Form'
import NotFound from './components/templates/NotFound'
import RegionList from './components/Track/RegionList'
import TrackForm from './components/Track/TrackForm'
import Edit from './components/User/Edit'
import UserVehicleList from './components/Vehicle/UserVehicleList'
import VehicleForm from './components/Vehicle/VehicleForm'
import VehicleSelects from './components/Vehicle/VehicleSelects'
import Home from './Home'

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

const theme = createTheme()

const App: React.FC = () => (
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <PrivateRoute exact path="/regions" component={RegionList} />
            <PrivateRoute exact path="/tracks/new" component={TrackForm} />
            <PrivateRoute exact path="/tracks/:id" component={TrackForm} />
            <PrivateRoute
              exact
              path="/maintenances"
              component={MaintenanceItemList}
            />
            <PrivateRoute
              exact
              path="/maintenances/new"
              component={MaintenanceItemForm}
            />
            <PrivateRoute exact path="/vehicles/new" component={VehicleForm} />
            <PrivateRoute exact path="/mypage" component={MyPage} />
            <PrivateRoute exact path="/user/edit" component={Edit} />
            <PrivateRoute
              exact
              path="/vehicles/edit"
              component={VehicleSelects}
            />
            <PrivateRoute exact path="/practice_records/new" component={Form} />
            <PrivateRoute exact path="/practice_records/:id" component={Form} />
            <PrivateRoute exact path="/vehicles" component={UserVehicleList} />
            <PrivateRoute
              exact
              path="/vehicles/:userVehicleId/maintenances"
              component={MaintenanceList}
            />
            <PrivateRoute
              exact
              path="/vehicles/:userVehicleId/maintenances/history"
              component={MaintenanceHistory}
            />
            <PrivateRoute
              exact
              path="/vehicles/:userVehicleId/maintenances/new"
              component={PeriodicMaintenanceForm}
            />
            <PrivateRoute
              exact
              path="/vehicles/:userVehicleId/maintenances/:id"
              component={PeriodicMaintenanceForm}
            />
            <PrivateRoute
              exact
              path="/maintenance_records/new"
              component={MaintenanceForm}
            />
            <PrivateRoute
              exact
              path="/maintenance_records/:id"
              component={MaintenanceForm}
            />
            <Route exact path="/login" component={Login} />
            <Route path="*" component={NotFound} />
          </Switch>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  </StyledEngineProvider>
)

export default App
