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
  maximumHours?: number
  showTotalHours?: boolean
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
  maximumHours = 10,
  showTotalHours,
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

  const convertDecimalTime = () => {
    const _minute = Math.round(Number(minutes.value) / 6)
    form.times.setValue(parseFloat(`${hours.value}.${_minute}`))
  }

  useEffect(
    () => {
      convertDecimalTime()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hours.value, minutes.value]
  )

  useEffect(
    () => {
      if (timeFormat === 'time') {
        minutes.setValue(
          form.times.value * 60 - Math.floor(form.times.value) * 60
        )
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
            label={<Typography variant="caption">小数点 [1/10]</Typography>}
          />
        </RadioGroup>
      </Grid>
      <Grid container justifyContent="flex-end" spacing={2}>
        {timeFormat === 'time' ? (
          <>
            <Grid item>
              {showTotalHours ? (
                <FormControlLabel
                  control={
                    <TextField
                      name="hours"
                      type="number"
                      variant="standard"
                      sx={{ width: '5ch' }}
                      value={hours.value}
                      onChange={hours.setValueFromEvent}
                    />
                  }
                  label="時間"
                />
              ) : (
                <FormControlLabel
                  control={
                    <NativeSelect
                      name="hours"
                      value={hours.value || 0}
                      onChange={hours.setValueFromEvent}
                    >
                      {[...Array(maximumHours + 1).keys()].map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </NativeSelect>
                  }
                  label="時間"
                />
              )}
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
          hours={hours.value}
          minutes={minutes.value}
          maximumHours={maximumHours}
          showTotalHours={showTotalHours}
          onClose={handleCloseTimesDialog}
          onSubmit={handleSubmitTimes}
        />
      </Grid>
      {secondaryContent && secondaryContent(timeFormat)}
    </Grid>
  )
}

export default TimeOrDecimalForm
