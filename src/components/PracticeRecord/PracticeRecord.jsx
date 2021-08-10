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
import { Link } from 'react-router-dom'
import SuccessNotification from '../Notification/SuccessNotification'

const PracticeRecord = ({
  id,
  offRoadTrack,
  vehicle,
  practiceDate,
  hours,
  minutes,
  memo,
  onDelete,
  onClose,
}) => {
  const [deleted, setDeleted] = useState(false)

  const handleDelete = () => {
    onDelete()
    setDeleted(true)
  }

  const handleClose = () => {
    onClose()
  }
  return (
    <>
      <Card>
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {practiceDate}
            </Typography>

            <Typography variant="caption" color="textSecondary">
              コース
            </Typography>
            <Typography variant="body1" component="p">
              {offRoadTrack.name}
            </Typography>

            <Typography variant="caption" color="textSecondary">
              バイク
            </Typography>
            <Typography variant="body1" component="p">
              {vehicle.modelName}
            </Typography>

            <Typography variant="caption" color="textSecondary">
              走行時間
            </Typography>
            <Typography variant="body1" component="p">
              {`${hours} 時間 ${minutes} 分`}
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
            <Link to={`practice_records/${id}`}>
              <EditIcon fontSize="small" />
            </Link>
          </IconButton>
          <IconButton onClick={handleDelete}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </CardActions>

        <SuccessNotification
          open={deleted}
          onClose={handleClose}
          message="削除しました！"
        />
      </Card>
    </>
  )
}

export default PracticeRecord
