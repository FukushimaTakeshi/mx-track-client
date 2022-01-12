import {
  Box,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Paper,
  Typography,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import firebase from 'firebase/app'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { apiClient } from '../lib/api_client'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.divider,
  },
  media: {
    height: 0,
    paddingTop: '24.25%',
  },
}))

const Login: React.FC = () => {
  const classes = useStyles()
  const history = useHistory()

  const handleSignInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    const userCredential = await firebase
      .auth()
      .signInWithPopup(provider)
      .catch((error) => {
        throw error
      })

    if (userCredential.user) {
      alert(
        'success : ' +
          userCredential.user.displayName +
          'さんでログインしました'
      )
      const token = await userCredential.user.getIdToken(true)
      const userVehicle = await apiClient.get('/user_vehicles/', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (userVehicle.data.length) {
        history.push('/dashboard')
      } else {
        // TODO: いい感じにする
        alert('はじめにバイクを登録してください。')
        history.push('/vehicles/edit')
      }
    }
  }

  return (
    <Box display={'flex'}>
      <Container maxWidth="sm" className={classes.container}>
        <Paper elevation={0}>
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="body2" component="h1">
                {
                  'MX Trackはオフロードコースなどの走行記録を管理するためのプラットフォームです。日々の練習での走行時間や整備を記録してバイクの状態を管理しましょう。'
                }
              </Typography>
              <Typography variant="body2" component="p">
                新規登録/ログイン どちらもこちらのボタンから可能です。
              </Typography>
              <CardMedia
                className={classes.media}
                image={'../btn_google_signin.png'}
                onClick={handleSignInWithGoogle}
              ></CardMedia>
            </CardContent>
          </CardActionArea>
        </Paper>
      </Container>
    </Box>
  )
}

export default Login
