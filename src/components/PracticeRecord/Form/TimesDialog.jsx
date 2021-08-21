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
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 80,
  },
}))

const TimesDialog = ({ open, onClose, form, handleSubmit }) => {
  const classes = useStyles()
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Grid container alignItems="flex-end" spacing={2}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="hours-dialog">時</InputLabel>
            <NativeSelect
              native
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
              native
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
        <Button onClick={handleSubmit} color="primary">
          設定
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TimesDialog
