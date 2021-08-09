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
