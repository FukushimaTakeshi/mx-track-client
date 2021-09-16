import {
  Button,
  Dialog,
  Divider,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Typography,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import Restricted from '../../auth/Restricted'
import { apiClient } from '../../lib/api_client'
import { Dashboard } from '../templates/Dashboard'
import Title from '../Title'
import PrefectureList from './PrefectureList'

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: 'none',
    color: theme.palette.text.secondary,
  },
}))

const RegionList: React.FC = () => {
  const classes = useStyles()
  const history = useHistory()
  const [regions, setRegions] = useState<Models.Region[]>([])
  useEffect(() => {
    apiClient.get('/regions').then((response) => setRegions(response.data))
  }, [])

  const [regionId, setRegionId] = useState<null | number>(null)
  const [showModal, setShowModal] = useState(false)
  const handleClick = (region: Models.Region) => {
    setShowModal(true)
    setRegionId(region.id)
  }
  const handleCloseModal = () => setShowModal(false)

  return (
    <Restricted to={'edit-off-road-tracks'}>
      <Dashboard>
        <>
          <Title>全国のオフロードコース一覧</Title>
          <Link to={'/tracks/new'} className={classes.link}>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              startIcon={<AddIcon />}
            >
              <Typography variant="subtitle1">新規コースの追加</Typography>
            </Button>
          </Link>
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
          <Dialog
            fullScreen
            open={showModal && !!regionId}
            onClose={handleCloseModal}
          >
            <PrefectureList
              regionId={regionId}
              onClose={handleCloseModal}
              handleSelectTrack={(track) => history.push(`/tracks/${track.id}`)}
            />
          </Dialog>
        </>
      </Dashboard>
    </Restricted>
  )
}

export default RegionList
