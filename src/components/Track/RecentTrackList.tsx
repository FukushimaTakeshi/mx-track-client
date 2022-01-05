import {
  Button,
  Dialog,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'

type Props = {
  onClickTrack(track: Models.OffRoadTrack): void
}

const RecentTrackList: React.FC<Props> = ({ onClickTrack }) => {
  const [showTrackList, setShowTrackList] = useState(false)
  const [tracks, setTracks] = useState<Models.OffRoadTrack[]>([])
  useEffect(() => {
    const recentTracks = localStorage.getItem('recent-tracks')
    if (recentTracks) {
      setTracks(JSON.parse(recentTracks))
    }
  }, [])

  const handleClose = () => setShowTrackList(false)

  const handleClickTrack = (track: Models.OffRoadTrack) => {
    onClickTrack(track)
    handleClose
  }

  if (!tracks.length) {
    return null
  }
  return (
    <>
      <List>
        <ListItem>
          <Button
            fullWidth
            variant="contained"
            color="info"
            onClick={() => setShowTrackList(true)}
          >
            <Typography variant="subtitle1">
              最近走行したコースから選択する
            </Typography>
          </Button>
        </ListItem>
      </List>
      <Dialog fullScreen open={showTrackList} onClose={handleClickTrack}>
        {tracks.map((track) => (
          <>
            <ListItem button key={track.id} onClick={() => onClickTrack(track)}>
              <ListItemText primary={track.name} />
            </ListItem>
            <Divider />
          </>
        ))}
        <List>
          <ListItem>
            <Button variant="outlined" fullWidth onClick={handleClose}>
              戻る
            </Button>
          </ListItem>
        </List>
      </Dialog>
    </>
  )
}

export default RecentTrackList
