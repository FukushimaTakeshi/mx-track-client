import firebase from 'firebase/app'
import React from 'react'
import { useHistory } from 'react-router-dom'

const Login = () => {
  const history = useHistory()

  const handleSignInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    // TODO: いい感じにする
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        alert('success : ' + result.user.displayName + 'さんでログインしました')
        history.push('/mypage')
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  return (
    <div>
      <div className="login">
        <h1>ログイン</h1>
      </div>
      <div className="signin_button">
        <img
          src="../btn_google_signin.png"
          onClick={handleSignInWithGoogle}
          alt="google signin"
        />
      </div>
    </div>
  )
}

export default Login
