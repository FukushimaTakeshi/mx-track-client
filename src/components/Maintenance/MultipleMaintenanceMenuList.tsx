import DeleteIcon from '@mui/icons-material/Delete'
import {
  Button,
  Checkbox,
  Container,
  Dialog,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
} from '@mui/material/'
import { makeStyles } from '@mui/styles'
import React, { useState } from 'react'
import { Form } from '../../hooks/useForm'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

type Props = {
  maintenanceMenuIdsForm: Form<number[]>
  maintenanceMenusWithCategories: Models.MaintenanceMenuWithCategory[]
}

const MultipleMaintenanceMenuList: React.FC<Props> = ({
  maintenanceMenuIdsForm,
  maintenanceMenusWithCategories,
}) => {
  const classes = useStyles()
  const [showDialog, setShowDialog] = useState(false)

  const handleToggle = (menuId: number) => () => {
    const checkedIds = maintenanceMenuIdsForm.value
    const currentIndex = checkedIds.indexOf(menuId)
    const newChecked = [...checkedIds]

    if (currentIndex === -1) {
      newChecked.push(menuId)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    maintenanceMenuIdsForm.setValue(newChecked)
  }

  const maintenanceMenuName = (menuId: number) => {
    const menus = maintenanceMenusWithCategories.flatMap((value) => value.menus)
    return menus.find((menu) => menu.id === menuId)?.name
  }

  const handleDelete = (menuId: number) => {
    const checkedIds = maintenanceMenuIdsForm.value
    const currentIndex = checkedIds.indexOf(menuId)
    const newChecked = [...checkedIds]
    newChecked.splice(currentIndex, 1)
    maintenanceMenuIdsForm.setValue(newChecked)
  }

  return (
    <>
      <Button variant="outlined" fullWidth onClick={() => setShowDialog(true)}>
        メンテナンス項目選択
      </Button>

      <Dialog fullScreen open={showDialog} onClose={() => setShowDialog(false)}>
        <Container component="main" maxWidth="xs" className={classes.container}>
          <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
          >
            {maintenanceMenusWithCategories.map((value) => (
              <List disablePadding key={value.categoryName}>
                <ListSubheader>{value.categoryName}</ListSubheader>
                {value.menus.map((menu) => (
                  <ListItem key={menu.id} disablePadding>
                    <ListItemButton
                      role={undefined}
                      onClick={handleToggle(menu.id)}
                      dense
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={
                            maintenanceMenuIdsForm.value.indexOf(menu.id) !== -1
                          }
                          tabIndex={-1}
                          disableRipple
                        />
                      </ListItemIcon>
                      <ListItemText primary={menu.name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            ))}
          </List>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={() => setShowDialog(false)}
          >
            決定
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setShowDialog(false)}
          >
            戻る
          </Button>
        </Container>
      </Dialog>
      <List>
        {maintenanceMenuIdsForm.value.map((id) => (
          <ListItem key={id}>
            <ListItemText inset secondary={maintenanceMenuName(id)} />
            <ListItemSecondaryAction>
              <IconButton onClick={() => handleDelete(id)} size="large">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </>
  )
}

export default MultipleMaintenanceMenuList
