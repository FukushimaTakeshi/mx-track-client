import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  Button,
  Dialog,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import Restricted from '../../auth/Restricted'
import { useAsyncExecutor } from '../../hooks/useAsyncExecutor'
import { useForm } from '../../hooks/useForm'
import { apiClient } from '../../lib/api_client'
import UnregisteredMaintenanceCategoryList from '../Maintenance/UnregisteredMaintenanceCategoryList'
import { Dashboard } from '../templates/Dashboard'
import Title from '../Title'

const useMaintenanceCategoryForm = () => {
  const name = useForm()
  return { name }
}

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: 'none',
    color: theme.palette.text.secondary,
  },
}))

const MaintenanceCategoryList: React.FC = () => {
  const form = useMaintenanceCategoryForm()
  const classes = useStyles()
  const history = useHistory()
  const [maintenanceCategories, setMaintenanceCategories] = useState<
    Models.MaintenanceCategory[]
  >([])

  const fetchMaintenanceCategories = () => {
    apiClient
      .get<Models.MaintenanceCategory[]>('/maintenance_categories')
      .then((response) => setMaintenanceCategories(response.data))
  }

  useEffect(() => {
    fetchMaintenanceCategories()
  }, [])

  const [clickedId, setClickedId] = useState<number | null>()
  const handleClickLabel = (
    maintenanceCategory: Models.MaintenanceCategory
  ) => {
    setClickedId(maintenanceCategory.id)
    form.name.setValue(maintenanceCategory.name)
  }

  const saveMenu = () => {
    const params = { name: form.name.value }
    return apiClient
      .put(`/maintenance_categories/${clickedId}`, params)
      .then(() => {
        const newMenus = maintenanceCategories.map((menu) => {
          if (menu.id === clickedId) {
            menu.name = form.name.value
          }
          return menu
        })
        setMaintenanceCategories(newMenus)
        setClickedId(null)
      })
  }

  const save = useAsyncExecutor(saveMenu, () => true)

  const handleDelete = (maintenanceCategoriId: number) => {
    apiClient
      .delete(`/maintenance_categories/${maintenanceCategoriId}`)
      .then(() => fetchMaintenanceCategories())
  }

  const [showUnregisteredCategories, setShowUnregisteredCategories] =
    useState(false)
  const handleOpenUnregisteredCategories = () =>
    setShowUnregisteredCategories(true)

  return (
    <Restricted to={'edit-maintenance-menus'}>
      <Dashboard>
        <>
          <Title>メンテナンスカテゴリ一覧</Title>
          <Link to={'/maintenances/new'} className={classes.link}>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              startIcon={<AddIcon />}
            >
              <Typography variant="subtitle1">
                新規メンテナンスカテゴリの追加
              </Typography>
            </Button>
          </Link>
          <List>
            {maintenanceCategories.map((maintenanceCategory) => (
              <React.Fragment key={maintenanceCategory.id}>
                <ListItem button>
                  {clickedId !== maintenanceCategory.id ? (
                    <>
                      <ListItemText
                        primary={maintenanceCategory.name}
                        onClick={() => handleClickLabel(maintenanceCategory)}
                      />
                      <ListItemButton
                        onClick={() =>
                          history.push(
                            `/maintenance_categories/${maintenanceCategory.id}`
                          )
                        }
                      >
                        更新
                      </ListItemButton>
                      <ListItemSecondaryAction>
                        <IconButton
                          onClick={() => handleDelete(maintenanceCategory.id)}
                          size="large"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </>
                  ) : (
                    <Grid container spacing={2}>
                      <Grid item xs={9}>
                        <TextField
                          autoFocus
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
            <ListItem button onClick={handleOpenUnregisteredCategories}>
              カテゴリ未登録
            </ListItem>
            <Dialog
              fullScreen
              open={showUnregisteredCategories}
              onClose={() => setShowUnregisteredCategories(false)}
            >
              <UnregisteredMaintenanceCategoryList
                maintenanceCategories={maintenanceCategories}
                onClose={() => setShowUnregisteredCategories(false)}
              />
            </Dialog>
          </List>
        </>
      </Dashboard>
    </Restricted>
  )
}

export default MaintenanceCategoryList
