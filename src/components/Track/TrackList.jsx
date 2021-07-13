import {
  AppBar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import React, { useEffect, useState } from 'react'
import { apiClient } from '../../lib/api_client'

const TrackList = ({ prefectureId, prefectureName, onClose, onClickTrack }) => {
  const [tracks, setTracks] = useState([])
  useEffect(() => {
    apiClient
      .get(`/off_road_tracks/?prefecture_id=${prefectureId}`)
      .then((res) => {
        setTracks(res.data)
      })
    // TODO: エラー処理
  }, [prefectureId])

  const useStyles = makeStyles((theme) => ({
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
  }))

  const classes = useStyles()

  const handleClick = (track) => {
    onClose()
    onClickTrack(track)
  }

  return (
    <React.Fragment>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {prefectureName}のモトクロスコース一覧
          </Typography>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <List>
        {tracks.map((track) => (
          <ListItem button key={track.id} onClick={() => handleClick(track)}>
            <ListItemText primary={track.name} secondary="Titania" />
          </ListItem>
        ))}
      </List>
    </React.Fragment>
  )
}

export default TrackList
