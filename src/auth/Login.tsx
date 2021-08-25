import {
  Box,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Paper,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import firebase from 'firebase/app'
import React from 'react'
import { useHistory } from 'react-router-dom'

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

const Login: React.FunctionComponent = () => {
  const classes = useStyles()
  const history = useHistory()

  const handleSignInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    // TODO: いい感じにする
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        if (result.user) {
          alert(
            'success : ' + result.user.displayName + 'さんでログインしました'
          )
        }
        history.push('/mypage')
      })
      .catch((error) => {
        alert(error.message)
      })
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
