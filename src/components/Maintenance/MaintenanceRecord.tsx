import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  IconButton,
  Typography,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SuccessNotification from '../Notification/SuccessNotification'

type Props = {
  onDelete(): void
  onClose(): void
} & Models.maintenanceRecord

const MaintenanceRecord: React.FC<Props> = ({
  id,
  maintenanceOn,
  operationHours,
  operationMinutes,
  memo,
  maintenanceMenu,
  onDelete,
  onClose,
}) => {
  const { userVehicleId } = useParams<{ userVehicleId?: string }>()
  const [deleted, setDeleted] = useState(false)

  const handleDelete = () => {
    onDelete()
    setDeleted(true)
  }

  return (
    <>
      <Card>
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {maintenanceOn}
            </Typography>

            <Typography variant="caption" color="textSecondary">
              メンテナンス項目
            </Typography>
            <Typography variant="body1" component="p">
              {maintenanceMenu.name}
            </Typography>

            <Typography variant="caption" color="textSecondary">
              稼働時間
            </Typography>
            <Typography variant="body1" component="p">
              {`${operationHours} 時間 ${operationMinutes} 分`}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              メモ
            </Typography>
            <Typography
              variant="body1"
              component="p"
              style={{ whiteSpace: 'pre-line' }}
            >
              {memo}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <IconButton>
            <Link to={`/vehicles/${userVehicleId}/maintenance_records/${id}`}>
              <EditIcon fontSize="small" />
            </Link>
          </IconButton>
          <IconButton onClick={handleDelete}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </CardActions>

        <SuccessNotification
          open={deleted}
          onClose={onClose}
          message="削除しました！"
        />
      </Card>
    </>
  )
}

export default MaintenanceRecord