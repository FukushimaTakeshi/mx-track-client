import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './auth/AuthProvider'
import Login from './auth/Login'
import PrivateRoute from './auth/PrivateRoute'
import MaintenanceForm from './components/Maintenance/MaintenanceForm'
import MaintenanceRecords from './components/Maintenance/MaintenanceRecords'
import MyPage from './components/MyPage'
import Form from './components/PracticeRecord/Form'
import Edit from './components/User/Edit'
import MaintenanceList from './components/Vehicle/MaintenanceList'
import PeriodicMaintenanceForm from './components/Vehicle/PeriodicMaintenanceForm'
import Home from './Home'

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <PrivateRoute exact path="/mypage" component={MyPage} />
          <PrivateRoute exact path="/user/edit" component={Edit} />
          <PrivateRoute exact path="/practice_records/new" component={Form} />
          <PrivateRoute exact path="/practice_records/:id" component={Form} />
          <PrivateRoute
            exact
            path="/vehicles/:userVehicleId/maintenances"
            component={MaintenanceList}
          />
          <PrivateRoute
            exact
            path="/vehicles/:userVehicleId/maintenances/records"
            component={MaintenanceRecords}
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
}

export default App
