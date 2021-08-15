import { useState } from 'react'

export const useForm = (defaultValue = '') => {
  const [error, setError] = useState('')
  const [value, setValue] = useState(defaultValue)

  return {
    error,
    setError,
    value,
    setValue,
    setValueFromEvent(event) {
      const newValue =
        event.target.type === 'checkbox' || event.target.type === 'radio'
          ? event.target.checked
          : event.target.value
      setValue(newValue)
    },
  }
}

export const responseToForm = (response, form) => {
  const data = response.data
  Object.keys(data).forEach((name) => {
    if (name in form) {
      form[name].setValue(data[name])
    }
  })
}

export const formToObject = (form) => {
  return Object.keys(form).reduce((object, name) => {
    object[name] = form[name].value
    return object
  }, {})
}
