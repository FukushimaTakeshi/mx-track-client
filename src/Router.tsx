import React from 'react'
import { Route, Switch } from 'react-router-dom'
import './App.css'
import Login from './auth/Login'
import PrivateRoute from './auth/PrivateRoute'
import SignUp from './auth/SignUp'
import Privacy from './components/Informations/Privacy'
import Term from './components/Informations/Term'
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
import { useTracking } from './hooks/useTracking'

const Router: React.FC = () => {
  useTracking()
  return (
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
      <PrivateRoute exact path="/vehicles/edit" component={VehicleSelects} />
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
      <Route exact path="/sign-up" component={SignUp} />
      <Route exact path="/term" component={Term} />
      <Route exact path="/privacy" component={Privacy} />
      <Route path="*" component={NotFound} />
    </Switch>
  )
}

export default Router
