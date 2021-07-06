import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './auth/AuthProvider'
import Login from './auth/Login'
import PrivateRoute from './auth/PrivateRoute'
import SignUp from './auth/SignUp'
import Form from './components/PracticeRecord/Form'
import Home from './Home'

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <PrivateRoute exact path="/mypage" component={Home} />
          <PrivateRoute exact path="/practice_records/:id" component={Form} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp} />
        </Switch>
      </Router>
    </AuthProvider>
  )
}

export default App
