import CloseIcon from '@mui/icons-material/Close'
import {
  AppBar,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
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

type Props = {
  prefecture: Models.Prefecture
  onClose: () => void
  onClickTrack: (track: Models.OffRoadTrack) => void
}

const TrackList: React.FC<Props> = ({ prefecture, onClose, onClickTrack }) => {
  const tracks = prefecture.offRoadTracks
  const classes = useStyles()

  const handleClick = (track: Models.OffRoadTrack) => {
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
            size="large"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <List>
        {tracks.map((track) => (
          <>
            <ListItem button key={track.id} onClick={() => handleClick(track)}>
              <ListItemText primary={track.name} />
            </ListItem>
            <Divider />
          </>
        ))}
      </List>
      <List>
        <ListItem>
          <Button variant="outlined" fullWidth onClick={onClose}>
            戻る
          </Button>
        </ListItem>
      </List>
    </React.Fragment>
  )
}

export default TrackList
