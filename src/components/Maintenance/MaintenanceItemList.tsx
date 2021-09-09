import {
  Button,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAsyncExecutor } from '../../hooks/useAsyncExecutor'
import { useForm } from '../../hooks/useForm'
import { apiClient } from '../../lib/api_client'
import { Dashboard } from '../templates/Dashboard'
import Title from '../Title'

const useMaintenanceMenuForm = () => {
  const name = useForm()
  return { name }
}

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: 'none',
    color: theme.palette.text.secondary,
  },
}))

const MaintenanceItemList: React.FC = () => {
  const form = useMaintenanceMenuForm()
  const classes = useStyles()
  const [maintenanceMenus, setMaintenanceMenus] = useState<
    Models.MaintenanceMenu[]
  >([])

  const fetchMaintenanceMenus = () => {
    apiClient
      .get('/maintenance_menus')
      .then((response) => setMaintenanceMenus(response.data))
  }

  useEffect(() => {
    fetchMaintenanceMenus()
  }, [])

  const [clickedId, setClickedId] = useState<number | null>()
  const handleClickLabel = (maintenanceMenu: Models.MaintenanceMenu) => {
    setClickedId(maintenanceMenu.id)
    form.name.setValue(maintenanceMenu.name)
  }

  const save = useAsyncExecutor(
    () => {
      const params = { name: form.name.value }
      return apiClient
        .put(`/maintenance_menus/${clickedId}`, params)
        .then(() => {
          const newMenus = maintenanceMenus.map((menu) => {
            if (menu.id === clickedId) {
              menu.name = form.name.value
            }
            return menu
          })
          setMaintenanceMenus(newMenus)
          setClickedId(null)
        })
    },
    () => true
  )

  const handleDelete = (maintenanceMenuId: number) => {
    apiClient
      .delete(`/maintenance_menus/${maintenanceMenuId}`)
      .then(() => fetchMaintenanceMenus())
  }

  return (
    <Dashboard>
      <>
        <Title>メンテナンス項目一覧</Title>
        <Link to={'/maintenances/new'} className={classes.link}>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            startIcon={<AddIcon />}
          >
            <Typography variant="subtitle1">
              新規メンテナンス項目の追加
            </Typography>
          </Button>
        </Link>
        <List>
          {maintenanceMenus.map((maintenanceMenu) => (
            <React.Fragment key={maintenanceMenu.id}>
              <ListItem button>
                {clickedId !== maintenanceMenu.id ? (
                  <>
                    <ListItemText
                      primary={maintenanceMenu.name}
                      onClick={() => handleClickLabel(maintenanceMenu)}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        onClick={() => handleDelete(maintenanceMenu.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </>
                ) : (
                  <Grid container spacing={2}>
                    <Grid item xs={9}>
                      <TextField
                        variant="outlined"
                        size="small"
                        value={form.name.value}
                        onChange={form.name.setValueFromEvent}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={save.execute}
                        disabled={save.isExecuting}
                      >
                        更新
                      </Button>
                    </Grid>
                  </Grid>
                )}
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </>
    </Dashboard>
  )
}

export default MaintenanceItemList
