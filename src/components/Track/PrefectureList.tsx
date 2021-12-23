import CloseIcon from '@mui/icons-material/Close'
import {
  AppBar,
  Button,
  Dialog,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { AxiosResponse } from 'axios'
import React, { Suspense, useEffect, useState } from 'react'
import { apiClient } from '../../lib/api_client'
import { Resource } from '../../lib/resource'
import InnerLoading from '../Spinner/InnerLoading'
import TrackList from './TrackList'

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
  regionId: number
  regionName: string
  onClose: () => void
  handleSelectTrack: (track: Models.OffRoadTrack) => void
}

type PrefecturesProps = {
  resource: Resource<AxiosResponse<Models.Region>> | null
}

const findRegion = (regionId: number) =>
  new Resource(() => apiClient.get<Models.Region>(`/regions/${regionId}`))

const PrefectureList: React.FC<Props> = ({
  regionId,
  regionName,
  onClose,
  handleSelectTrack,
}) => {
  const classes = useStyles()

  const [resource, setResource] = useState<Resource<
    AxiosResponse<Models.Region>
  > | null>(null)

  useEffect(() => {
    setResource(findRegion(regionId))
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

  const handleClickTrack = (track: Models.OffRoadTrack) => {
    handleSelectTrack(track)
    handleCloseModal()
    onClose()
  }

  const Prefectures: React.FC<PrefecturesProps> = ({ resource }) => {
    const region = resource?.read().data
    return (
      <>
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
        <List>
          <ListItem>
            <Button variant="outlined" fullWidth onClick={onClose}>
              戻る
            </Button>
          </ListItem>
        </List>
        <Dialog fullScreen open={showModal} onClose={handleCloseModal}>
          <TrackList
            prefecture={clickedPrefecture}
            onClose={handleCloseModal}
            onClickTrack={(track: Models.OffRoadTrack) =>
              handleClickTrack(track)
            }
          />
        </Dialog>
      </>
    )
  }

  return (
    <>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {`${regionName}のモトクロスコース一覧`}
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
      <Suspense fallback={<InnerLoading loading />}>
        <Prefectures resource={resource} />
      </Suspense>
    </>
  )
}

export default PrefectureList
