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

const PrefectureList = ({ regionId, handleClose }) => {
  const [region, setRegion] = useState(null)
  useEffect(() => {
    const token = localStorage.getItem('token')
    apiClient
      .get(`/regions/${regionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setRegion(res.data)
      })
  }, [regionId])

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
            onClick={handleClose}
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
              <ListItemText primary={prefecture.name} secondary="Titania" />
            </ListItem>
          ))}
      </List>
    </React.Fragment>
  )
}

export default PrefectureList
