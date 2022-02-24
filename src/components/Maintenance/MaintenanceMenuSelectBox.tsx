import { FormControl, InputLabel, Select } from '@mui/material'
import React from 'react'
import { Form } from '../../hooks/useForm'

type Props = {
  maintenanceMenuForm: Form<Models.MaintenanceMenu>
  maintenanceMenus: Models.MaintenanceMenu[]
  maintenanceMenusWithCategories: Models.MaintenanceMenuWithCategory[]
}

const MaintenanceMenuSelectBox: React.FC<Props> = ({
  maintenanceMenuForm,
  maintenanceMenus,
  maintenanceMenusWithCategories,
}) => {
  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel required shrink id="menu-label">
        メンテナンス項目
      </InputLabel>
      <Select
        native
        name="maintenanceMenu"
        label="メンテナンス項目"
        labelId="menu-label"
        value={maintenanceMenuForm.value.id}
        onChange={(e) =>
          maintenanceMenuForm.setValueFromModels(e, maintenanceMenus)
        }
      >
        {maintenanceMenusWithCategories.map((value) => (
          <optgroup key={value.categoryName} label={value.categoryName}>
            {value.menus.map((menu) => (
              <option key={menu.name} value={menu.id}>
                {menu.name}
              </option>
            ))}
          </optgroup>
        ))}
      </Select>
    </FormControl>
  )
}

export default MaintenanceMenuSelectBox
