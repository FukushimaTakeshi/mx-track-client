import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Select,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useAsyncExecutor } from '../../hooks/useAsyncExecutor'
import { useForm } from '../../hooks/useForm'
import { apiClient, apiClientWithAuth } from '../../lib/api_client'

type Props = {
  maintenanceCategories: Models.MaintenanceCategory[]
  onClose: () => void
}

type FormProps = {
  maintenanceMenuId: number
}
const useMaintenanceCategoryForm = () => {
  const maintenanceCategory = useForm({} as Models.MaintenanceCategory)
  return { maintenanceCategory }
}

const UnregisteredMaintenanceCategoryList: React.FC<Props> = ({
  maintenanceCategories,
  onClose,
}) => {
  const [maintenanceMenus, setMaintenanceMenus] = useState<
    Models.MaintenanceMenu[]
  >([])

  useEffect(() => {
    apiClient
      .get<Models.MaintenanceMenuWithCategory[]>('/maintenance_menus')
      .then((response) => {
        const unregisteredCategory = response.data.find(
          (value) => value.categoryName == null
        )
        const maintenanceMenus = unregisteredCategory?.menus
        if (maintenanceMenus) {
          setMaintenanceMenus(maintenanceMenus)
        }
      })
  }, [])

  const Form: React.FC<FormProps> = ({ maintenanceMenuId }) => {
    const form = useMaintenanceCategoryForm()
    const save = useAsyncExecutor(
      () => {
        const params = {
          maintenanceCategoryId: form.maintenanceCategory.value.id,
        }
        return apiClientWithAuth.put(
          `/maintenance_menus/${maintenanceMenuId}`,
          params
        )
      },
      () => true
    )

    return (
      <>
        <FormControl variant="outlined">
          <InputLabel required shrink id="menu-label">
            メンテナンスカテゴリ
          </InputLabel>
          <Select
            native
            name="maintenanceMenu"
            label="メンテナンス項目"
            labelId="menu-label"
            value={form.maintenanceCategory.value.id}
            onChange={(e) =>
              form.maintenanceCategory.setValueFromModels(
                e,
                maintenanceCategories
              )
            }
          >
            {maintenanceCategories.map((maintenanceCategory) => (
              <option
                key={maintenanceCategory.id}
                value={maintenanceCategory.id}
              >
                {maintenanceCategory.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <Button onClick={save.execute}>更新</Button>
      </>
    )
  }

  return (
    <>
      {maintenanceMenus.map((maintenanceMenu) => (
        <>
          <ListItem button key={maintenanceMenu.id}>
            <ListItemText primary={maintenanceMenu.name} />
            <Form maintenanceMenuId={maintenanceMenu.id} />
          </ListItem>
          <Divider />
        </>
      ))}
      <List>
        <ListItem>
          <Button variant="outlined" fullWidth onClick={onClose}>
            戻る
          </Button>
        </ListItem>
      </List>
    </>
  )
}

export default UnregisteredMaintenanceCategoryList
