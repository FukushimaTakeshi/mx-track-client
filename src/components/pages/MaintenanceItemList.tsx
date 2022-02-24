import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  Button,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import Restricted from '../../auth/Restricted'
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
  const { id } = useParams<{ id?: string }>()
  const form = useMaintenanceMenuForm()
  const classes = useStyles()
  const [maintenanceCategoryWithMenus, setMaintenanceCategoryWithMenus] =
    useState<Models.MaintenanceCategoryWithMenus>({
      menus: [{} as Models.MaintenanceMenu],
    } as Models.MaintenanceCategoryWithMenus)

  const fetchMaintenanceMenus = () => {
    apiClient
      .get<Models.MaintenanceCategoryWithMenus>(`/maintenance_categories/${id}`)
      .then((response) => setMaintenanceCategoryWithMenus(response.data))
  }

  useEffect(() => {
    fetchMaintenanceMenus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [clickedId, setClickedId] = useState<number | null>()
  const handleClickLabel = (maintenanceMenu: Models.MaintenanceMenu) => {
    setClickedId(maintenanceMenu.id)
    form.name.setValue(maintenanceMenu.name)
  }

  const saveMenu = () => {
    const params = { name: form.name.value }
    return apiClient.put(`/maintenance_menus/${clickedId}`, params).then(() => {
      const newMenus = maintenanceCategoryWithMenus.menus.map((menu) => {
        if (menu.id === clickedId) {
          menu.name = form.name.value
        }
        return menu
      })
      setMaintenanceCategoryWithMenus({
        ...maintenanceCategoryWithMenus,
        menus: newMenus,
      })
      setClickedId(null)
    })
  }

  const save = useAsyncExecutor(saveMenu, () => true)

  const handleDelete = (maintenanceMenuId: number) => {
    apiClient
      .delete(`/maintenance_menus/${maintenanceMenuId}`)
      .then(() => fetchMaintenanceMenus())
  }

  return (
    <Restricted to={'edit-maintenance-menus'}>
      <Dashboard>
        <>
          <Title>メンテナンス項目一覧</Title>
          <Link
            to={{
              pathname: '/maintenances/new',
              search: `?maintenance_category_id=${id}`,
            }}
            className={classes.link}
          >
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
            {maintenanceCategoryWithMenus.menus.map((maintenanceMenu) => (
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
          </List>
        </>
      </Dashboard>
    </Restricted>
  )
}

export default MaintenanceItemList
