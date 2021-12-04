import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  Input,
  InputLabel,
  NativeSelect,
  Typography,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import React from 'react'
import { useForm } from '../../hooks/useForm'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 80,
  },
}))

const useTimeDialogForm = () => {
  const hours = useForm(0)
  const minutes = useForm(0)
  return { hours, minutes }
}

type Props = {
  open: boolean
  onClose: () => void
  onSubmit(hours: number, minutes: number): void
}

const TimesDialog: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const classes = useStyles()
  const form = useTimeDialogForm()
  const _handleSubmit = () => {
    onSubmit(form.hours.value, form.minutes.value)
  }
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Grid container alignItems="flex-end" spacing={2}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="hours-dialog">時</InputLabel>
            <NativeSelect
              value={form.hours.value}
              onChange={form.hours.setValueFromEvent}
              input={<Input id="hours-dialog" />}
            >
              {[...Array(24).keys()].map((value) => (
                <option key={`times-hour-${value}`} value={value}>
                  {value}
                </option>
              ))}
            </NativeSelect>
          </FormControl>
          <Typography variant="h6">.</Typography>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="minutes-dialog">分</InputLabel>
            <NativeSelect
              value={form.minutes.value}
              onChange={form.minutes.setValueFromEvent}
              input={<Input id="minutes-dialog" />}
            >
              {[...Array(10).keys()].map((value) => (
                <option key={`times-minute-${value}`} value={value}>
                  {value}
                </option>
              ))}
            </NativeSelect>
          </FormControl>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={_handleSubmit} color="primary">
          設定
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TimesDialog
