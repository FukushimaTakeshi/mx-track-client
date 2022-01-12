import { Button, Container, Divider, Grid, Typography } from '@mui/material'
import React from 'react'
import { Dashboard } from '../templates/Dashboard'

const Home: React.FC = () => {
  return (
    <Dashboard disableSpeedDial>
      <>
        <Container maxWidth="sm">
          <Typography
            component="h2"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            MX Track
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            paragraph
          >
            MX
            Trackはオフロードコースでの走行記録を管理するためのプラットフォームです。日々の練習での走行時間や整備を記録してバイクの状態を管理しましょう。
          </Typography>
        </Container>
        <Divider />

        <Container
          sx={{
            mt: 10,
            mb: 15,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" align="center" component="h2" sx={{ mb: 6 }}>
            How it works
          </Typography>

          <Grid container spacing={5}>
            <Grid item xs={12} md={6}>
              <Typography
                component="h6"
                variant="h6"
                align="center"
                color="text.primary"
                gutterBottom
              >
                1. 走行を記録する
              </Typography>
              <Typography variant="subtitle2" align="center">
                練習したら、走行時間を登録しましょう。
                <br />
                練習中の走行タイムや課題をメモに残して後で見返すことも可能です。
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                component="h6"
                variant="h6"
                align="center"
                color="text.primary"
                gutterBottom
              >
                2. 整備を記録する
              </Typography>
              <Typography variant="subtitle2" align="center">
                整備を行ったら、整備内容を登録しましょう。登録した整備内容は一覧で確認できます。
              </Typography>
            </Grid>
          </Grid>
          <Button
            size="large"
            variant="contained"
            component="a"
            href="/login/"
            sx={{ mt: 8 }}
          >
            登録してやってみる！
          </Button>
        </Container>
      </>
    </Dashboard>
  )
}

export default Home
