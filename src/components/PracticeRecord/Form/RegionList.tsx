import CloseIcon from '@mui/icons-material/Close'
import {
  AppBar,
  Button,
  Dialog,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AxiosResponse } from 'axios'
import React, { Suspense, useState } from 'react'
import { apiClient } from '../../../lib/api_client'
import { Resource } from '../../../lib/resource'
import InnerLoading from '../../Spinner/InnerLoading'
import PrefectureList from '../../Track/PrefectureList'

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}))

const resource = new Resource(() => apiClient.get<Models.Region[]>('/regions/'))

type Props = {
  onClose: () => void
  handleSelectTrack: (track: Models.OffRoadTrack) => void
}

type RegionsProps = {
  resource: Resource<AxiosResponse<Models.Region[]>>
}

const RegionList: React.FC<Props> = ({ onClose, handleSelectTrack }) => {
  const classes = useStyles()
  const [region, setRegion] = useState<Models.Region>({} as Models.Region)
  const handleClick = (value: Models.Region) => {
    setRegion(value)
    setShowPrefecture(true)
  }

  const [showPrefecture, setShowPrefecture] = useState(false)
  const handleClosePrefecture = () => setShowPrefecture(false)

  const _handleSelectTrack = (track: Models.OffRoadTrack) => {
    handleSelectTrack(track)
    handleClosePrefecture()
    onClose()
  }

  const Regions: React.FC<RegionsProps> = ({ resource }) => {
    const regions = resource.read().data
    return (
      <>
        <List>
          {regions.map((region) => (
            <React.Fragment key={region.id}>
              <ListItem button onClick={() => handleClick(region)}>
                <ListItemText primary={region.name} />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
        <List>
          <ListItem>
            <Button variant="outlined" fullWidth onClick={onClose}>
              戻る
            </Button>
          </ListItem>
        </List>
        <Dialog
          fullScreen
          open={showPrefecture}
          onClose={handleClosePrefecture}
        >
          <PrefectureList
            regionId={region.id ?? 0}
            regionName={region.name ?? ''}
            onClose={handleClosePrefecture}
            handleSelectTrack={_handleSelectTrack}
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
            全国のモトクロスコース一覧
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
        <Regions resource={resource} />
      </Suspense>
    </>
  )
}

export default RegionList
