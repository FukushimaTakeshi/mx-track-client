import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './auth/AuthProvider'
import Login from './auth/Login'
import PrivateRoute from './auth/PrivateRoute'
import MyPage from './components/MyPage'
import Form from './components/PracticeRecord/Form'
import Edit from './components/User/Edit'
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
          <Route exact path="/login" component={Login} />
        </Switch>
      </Router>
    </AuthProvider>
  )
}

export default App
