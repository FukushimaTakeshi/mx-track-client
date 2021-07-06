import React, { useContext } from 'react'
import { withRouter } from 'react-router'
import { useHistory } from 'react-router-dom'
import { AuthContext } from './AuthProvider'

const Login = () => {
  const { login } = useContext(AuthContext)
  const history = useHistory()

  const handleSubmit = async (event) => {
    event.preventDefault()
    const { email, password } = event.target.elements
    await login(email.value, password.value)
    history.push('/mypage')
  }

  return (
    <div>
      <h1>Log in</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input name="email" type="email" placeholder="Email" />
        </label>
        <label>
          Password
          <input name="password" type="password" placeholder="Password" />
        </label>
        <button type="submit">Log in</button>
      </form>
    </div>
  )
}

export default withRouter(Login)
