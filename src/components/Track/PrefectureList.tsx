import {
  AppBar,
  Dialog,
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
import TrackList from './TrackList'

type Props = {
  regionId: number | null
  onClose: () => void
  handleSelectTrack: (track: Models.OffRoadTrack) => void
}

const PrefectureList: React.FC<Props> = ({
  regionId,
  onClose,
  handleSelectTrack,
}) => {
  const [region, setRegion] = useState<Models.Region | null>(null)
  useEffect(() => {
    apiClient.get(`/regions/${regionId}`).then((res) => {
      setRegion(res.data)
    })
    // TODO: エラー処理
  }, [regionId])

  const [showModal, setShowModal] = useState(false)
  const [clickedPrefecture, setClickedPrefecture] = useState(
    {} as Models.Prefecture
  )
  const handleClick = (prefecture: Models.Prefecture) => {
    setShowModal(true)
    setClickedPrefecture(prefecture)
  }
  const handleCloseModal = () => setShowModal(false)

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

  const handleClickTrack = (track: Models.OffRoadTrack) => {
    handleSelectTrack(track)
    handleCloseModal()
    onClose()
  }

  return (
    <React.Fragment>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {region && `${region.name}のモトクロスコース一覧`}
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
        {region &&
          region.prefectures.map((prefecture) => (
            <ListItem button key={prefecture.id}>
              <ListItemText
                primary={prefecture.name}
                secondary={`登録コース: ${prefecture.offRoadTracks.length} 件`}
                onClick={() => handleClick(prefecture)}
              />
            </ListItem>
          ))}
      </List>
      <Dialog fullScreen open={showModal} onClose={handleCloseModal}>
        <TrackList
          prefecture={clickedPrefecture}
          onClose={handleCloseModal}
          onClickTrack={(track: Models.OffRoadTrack) => handleClickTrack(track)}
        />
      </Dialog>
    </React.Fragment>
  )
}

export default PrefectureList