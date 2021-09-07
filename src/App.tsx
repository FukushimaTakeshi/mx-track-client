import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './auth/AuthProvider'
import Login from './auth/Login'
import PrivateRoute from './auth/PrivateRoute'
import MaintenanceForm from './components/Maintenance/MaintenanceForm'
import MaintenanceHistory from './components/Maintenance/MaintenanceHistory'
import MaintenanceList from './components/Maintenance/MaintenanceList'
import PeriodicMaintenanceForm from './components/Maintenance/PeriodicMaintenanceForm'
import MyPage from './components/MyPage'
import Form from './components/PracticeRecord/Form'
import RegionList from './components/Track/RegionList'
import TrackForm from './components/Track/TrackForm'
import Edit from './components/User/Edit'
import UserVehicleList from './components/Vehicle/UserVehicleList'
import VehicleSelects from './components/Vehicle/VehicleSelects'
import Home from './Home'

const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/regions" component={RegionList} />
        <Route exact path="/tracks/new" component={TrackForm} />
        <Route exact path="/tracks/:id" component={TrackForm} />
        <PrivateRoute exact path="/mypage" component={MyPage} />
        <PrivateRoute exact path="/user/edit" component={Edit} />
        <PrivateRoute exact path="/vehicles/edit" component={VehicleSelects} />
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
          path="/vehicles/:userVehicleId/maintenance_records/new"
          component={MaintenanceForm}
        />
        <PrivateRoute
          exact
          path="/vehicles/:userVehicleId/maintenance_records/:id"
          component={MaintenanceForm}
        />
        <Route exact path="/login" component={Login} />
      </Switch>
    </Router>
  </AuthProvider>
)

export default App
