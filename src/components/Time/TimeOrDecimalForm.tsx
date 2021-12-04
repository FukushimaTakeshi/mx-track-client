import {
  FormControlLabel,
  Grid,
  InputAdornment,
  NativeSelect,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Form, useForm } from '../../hooks/useForm'
import TimesDialog from './TimesDialog'

type Props = {
  title: string
  hours: Form<number>
  minutes: Form<number>
  secondaryContent?(timeFormat: string): React.ReactNode
}

const useTimesForm = () => {
  const times = useForm(0)
  return { times }
}

const TimeOrDecimalForm: React.FC<Props> = ({
  title,
  hours,
  minutes,
  secondaryContent,
}) => {
  const form = useTimesForm()
  const [openTimesDialog, setOpenTimesDialog] = useState(false)
  const handleClickTimes = () => setOpenTimesDialog(true)
  const handleCloseTimesDialog = () => setOpenTimesDialog(false)

  const [timeFormat, setTimeFormat] = useState('time')
  const handleChangeTimeFormat = (event: React.ChangeEvent<HTMLInputElement>) =>
    setTimeFormat(event.target.value)

  const handleSubmitTimes = (_hours: number, _minutes: number) => {
    handleCloseTimesDialog()
    form.times.setValue(parseFloat(`${_hours}.${_minutes}`))
    hours.setValue(_hours)
    minutes.setValue(Number(_minutes) * 6)
  }

  useEffect(
    () => {
      if (timeFormat === 'time') {
        const _minutes =
          form.times.value * 60 - Math.floor(form.times.value) * 60
        minutes.setValue(_minutes)
      } else {
        const _minute = Math.round(Number(minutes.value) / 6)
        minutes.setValue(_minute)
        form.times.setValue(parseFloat(`${hours.value}.${_minute}`))
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [timeFormat]
  )

  return (
    <Grid item xs={12}>
      <Typography variant="caption" color="textSecondary">
        {title}
      </Typography>

      <Grid item xs={12}>
        <RadioGroup
          row
          aria-label="time-format"
          name="timeFormat"
          value={timeFormat}
          onChange={handleChangeTimeFormat}
        >
          <FormControlLabel
            value="time"
            control={<Radio />}
            label={<Typography variant="caption">時刻</Typography>}
          />
          <FormControlLabel
            value="decimal"
            control={<Radio />}
            label={<Typography variant="caption">小数点</Typography>}
          />
        </RadioGroup>
      </Grid>
      <Grid container justifyContent="flex-end" spacing={2}>
        {timeFormat === 'time' ? (
          <>
            <Grid item>
              <FormControlLabel
                control={
                  <NativeSelect
                    name="hours"
                    value={hours.value || 0}
                    onChange={hours.setValueFromEvent}
                  >
                    {[...Array(24).keys()].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </NativeSelect>
                }
                label="時間"
              />
            </Grid>
            <Grid item>
              <FormControlLabel
                control={
                  <NativeSelect
                    name="minutes"
                    value={minutes.value || 0}
                    onChange={minutes.setValueFromEvent}
                  >
                    {[...Array(60).keys()].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </NativeSelect>
                }
                label="分"
              />
            </Grid>
          </>
        ) : (
          <Grid item xs={4}>
            <TextField
              name="time"
              value={form.times.value}
              onClick={handleClickTimes}
              variant="standard"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="button" color="textSecondary">
                      時間
                    </Typography>
                  </InputAdornment>
                ),
                readOnly: true,
              }}
            />
          </Grid>
        )}
        <TimesDialog
          open={openTimesDialog}
          onClose={handleCloseTimesDialog}
          onSubmit={handleSubmitTimes}
        />
      </Grid>
      {secondaryContent && secondaryContent(timeFormat)}
    </Grid>
  )
}

export default TimeOrDecimalForm
