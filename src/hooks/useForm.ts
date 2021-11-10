/* eslint-disable @typescript-eslint/no-explicit-any */
import { SelectChangeEvent } from '@mui/material'
import React, { useState } from 'react'

export interface Form<T = string> {
  error: string
  setError(value: string): void
  value: T
  setValue(value: T): void
  setValueFromEvent(
    event:
      | React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
      | SelectChangeEvent
  ): void
}

export const useForm = <T = string>(
  defaultValue: T = '' as unknown as T
): Form<T> => {
  const [error, setError] = useState('')
  const [value, setValue] = useState<T>(defaultValue)

  return {
    error,
    setError,
    value,
    setValue,
    setValueFromEvent(event: React.ChangeEvent<HTMLInputElement>) {
      const newValue =
        event.target.type === 'checkbox' || event.target.type === 'radio'
          ? (event.target.checked as unknown as T)
          : (event.target.value as unknown as T)
      setValue(newValue)
    },
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormRecord = Record<string, Form<any>>

export const responseToForm = <T extends FormRecord>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: { data: any },
  form: T
): void => {
  const data = response.data
  Object.keys(data).forEach((name) => {
    if (name in form) {
      form[name].setValue(data[name])
    }
  })
}

type ToValues<T extends Record<any, Form<any>>> = {
  [K in keyof T]: T[K]['value']
}

export const formToObject = <T extends FormRecord>(form: T): ToValues<T> => {
  return Object.keys(form).reduce((object, name) => {
    object[name as unknown as keyof T] = form[name].value
    return object
  }, {} as ToValues<T>)
}
