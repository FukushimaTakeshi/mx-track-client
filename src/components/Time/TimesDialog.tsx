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
  TextField,
  Typography,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import React, { useEffect } from 'react'
import { useForm } from '../../hooks/useForm'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 80,
  },
}))

const useTimeDialogForm = (_hours: number, _minutes: number) => {
  const hours = useForm<number>(_hours)
  const minutes = useForm<number>(_minutes)
  return { hours, minutes }
}

type Props = {
  open: boolean
  hours: number
  minutes: number
  maximumHours: number
  showTotalHours?: boolean
  onClose: () => void
  onSubmit(hours: number, minutes: number): void
}

const TimesDialog: React.FC<Props> = ({
  open,
  hours,
  minutes,
  maximumHours,
  showTotalHours,
  onClose,
  onSubmit,
}) => {
  const classes = useStyles()
  const form = useTimeDialogForm(hours, minutes)
  const _handleSubmit = () => {
    onSubmit(form.hours.value, form.minutes.value)
  }

  useEffect(() => {
    form.hours.setValue(hours)
    form.minutes.setValue(minutes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hours, minutes])

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Grid container alignItems="flex-end" spacing={2}>
          <FormControl className={classes.formControl}>
            <InputLabel shrink htmlFor="hours-dialog">
              時
            </InputLabel>
            {showTotalHours ? (
              <TextField
                id="hours-dialog"
                type="number"
                variant="standard"
                sx={{ mt: 2, width: '7ch' }}
                value={form.hours.value}
                onChange={form.hours.setValueFromEvent}
              />
            ) : (
              <NativeSelect
                value={form.hours.value}
                onChange={form.hours.setValueFromEvent}
                input={<Input id="hours-dialog" />}
              >
                {[...Array(maximumHours + 1).keys()].map((value) => (
                  <option key={`times-hour-${value}`} value={value}>
                    {value}
                  </option>
                ))}
              </NativeSelect>
            )}
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
