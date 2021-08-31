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
import React from 'react'

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}))

const TrackList = ({ prefecture, onClose, onClickTrack }) => {
  const tracks = prefecture.offRoadTracks
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
            {prefecture.name}のモトクロスコース一覧
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
