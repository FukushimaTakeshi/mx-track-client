import React, { useContext } from 'react'
import { withRouter } from 'react-router'
import { AuthContext } from './AuthProvider'

const SignUp = () => {
  const { signUp } = useContext(AuthContext)
  const handleSubmit = (event) => {
    event.preventDefault()
    const { email, password } = event.target.elements
    signUp(email.value, password.value)
  }

  return (
    <div>
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input name="email" type="email" placeholder="Email" />
        </label>
        <label>
          Password
          <input name="password" type="password" placeholder="Password" />
        </label>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  )
}

export default withRouter(SignUp)
