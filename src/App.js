import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './auth/AuthProvider'
import Login from './auth/Login'
import PrivateRoute from './auth/PrivateRoute'
import SignUp from './auth/SignUp'
import Home from './Home'

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <PrivateRoute exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp} />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
