import {
  Box,
  CardActionArea,
  CardContent,
  Container,
  Paper,
  Typography,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import React from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import { firebaseApp } from './auth'

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

// Configure FirebaseUI.
const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/sign-up',
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
}

const Login: React.FC = () => {
  const classes = useStyles()

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
              <StyledFirebaseAuth
                uiConfig={uiConfig}
                firebaseAuth={firebaseApp.auth()}
              />
            </CardContent>
          </CardActionArea>
        </Paper>
      </Container>
    </Box>
  )
}

export default Login
