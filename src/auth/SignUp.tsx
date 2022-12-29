import firebase from 'firebase/compat/app'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router'
import Loading from '../components/Spinner/Loading'
import { apiClient } from '../lib/api_client'

const onAuthStateChangedAsync = async (): Promise<firebase.User | null> => {
  return new Promise((resolve) => {
    firebase.auth().onAuthStateChanged((user) => {
      resolve(user)
    })
  })
}

const SignUp: React.FC = () => {
  const history = useHistory()
  useEffect(() => {
    const getIdToken = async () => {
      const user = await onAuthStateChangedAsync()
      const idToken = await user?.getIdToken()
      if (!user || idToken === '') {
        alert('ログインして下さい。')
        history.push('/login')
      } else {
        idToken && localStorage.setItem('token', idToken)
        const { displayName, email, photoURL } = user
        try {
          await apiClient.post(
            '/users',
            {
              token: idToken,
              name: displayName,
              email,
              photoURL,
            },
            { headers: { 'Cache-Control': `max-age=${60 * 60 * 24 * 30}` } }
          )
          alert('OK! : ' + user.displayName + 'さんでログインしました')
          history.push('/dashboard')
        } catch (error) {
          alert(
            '認証に失敗しました。しばらく時間をおいてから再度お試しください。'
          )
          history.push('/')
        }
      }
    }
    getIdToken()
  }, [history])

  return <Loading loading={true} />
}

export default SignUp
