import { FormControl, InputLabel, Select } from '@mui/material'
import React from 'react'
import { Form } from '../../hooks/useForm'

type Props = {
  maintenanceMenuForm: Form<Models.MaintenanceMenu>
  maintenanceMenus: Models.MaintenanceMenu[]
}

const MaintenanceMenuSelectBox: React.FC<Props> = ({
  maintenanceMenuForm,
  maintenanceMenus,
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
        {maintenanceMenus.map((value, i) => (
          <option key={i} value={value.id}>
            {value.name}
          </option>
        ))}
      </Select>
    </FormControl>
  )
}

export default MaintenanceMenuSelectBox
