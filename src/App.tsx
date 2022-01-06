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
import Dashboard from './components/pages/Dashboard'
import Home from './components/pages/Home'
import MaintenanceForm from './components/pages/MaintenanceForm'
import MaintenanceHistory from './components/pages/MaintenanceHistory'
import MaintenanceItemForm from './components/pages/MaintenanceItemForm'
import MaintenanceItemList from './components/pages/MaintenanceItemList'
import PeriodicMaintenanceForm from './components/pages/PeriodicMaintenanceForm'
import PeriodicMaintenanceList from './components/pages/PeriodicMaintenanceList'
import RegionList from './components/pages/RegionList'
import TrackForm from './components/pages/TrackForm'
import UserEdit from './components/pages/UserEdit'
import UserVehicleList from './components/pages/UserVehicleList'
import VehicleForm from './components/pages/VehicleForm'
import VehicleSelects from './components/pages/VehicleSelects'
import Form from './components/PracticeRecord/Form'
import NotFound from './components/templates/NotFound'

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
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute exact path="/user/edit" component={UserEdit} />
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
              component={PeriodicMaintenanceList}
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
