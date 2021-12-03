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
import React, { useEffect, useState } from 'react'
import { apiClient } from '../../../lib/api_client'
import PrefectureList from '../../Track/PrefectureList'

type Props = {
  onClose: () => void
  handleSelectTrack: (track: Models.OffRoadTrack) => void
}

const RegionList: React.FC<Props> = ({ onClose, handleSelectTrack }) => {
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

  const [regions, setRegions] = useState<Models.Region[]>([])

  useEffect(() => {
    apiClient.get('/regions/').then((res) => {
      setRegions(res.data)
    })
  }, [])

  const [region, setRegion] = useState<Models.Region>()
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
      <Dialog fullScreen open={showPrefecture} onClose={handleClosePrefecture}>
        <PrefectureList
          regionId={region?.id || 0}
          onClose={handleClosePrefecture}
          handleSelectTrack={_handleSelectTrack}
        />
      </Dialog>
    </>
  )
}

export default RegionList
