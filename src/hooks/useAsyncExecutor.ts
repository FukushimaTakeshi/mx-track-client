import { useState } from 'react'

export interface Task {
  error: string
  setError(value: string): void
  isExecuting: boolean
  setIsExecuting(value: boolean): void
  execute(): void
}

type Run = (task: Task) => Promise<unknown>
type Validate = () => boolean

export const useAsyncExecutor = (run: Run, validate: Validate): Task => {
  const [isExecuting, setIsExecuting] = useState(false)
  const [error, setError] = useState('')
  const execute = () => {
    // if (event && event.preventDefault) {
    //   event.preventDefault()
    // }
    setError('')

    if (isExecuting || !validate()) {
      return
    }

    setIsExecuting(true)
    run(task)
      .catch((error) => {
        if (!error.response) {
          throw error
        }

        const httpStatus = error.response.status

        if (httpStatus >= 500) {
          task.setError('サーバーで問題が発生しました')
        } else if (httpStatus === 403) {
          task.setError('アクセスが許可されていません')
        } else if (error.response.status >= 400) {
          task.setError('入力内容が不正です。入力内容を確認してください。')
        }
      })
      .finally(() => setIsExecuting(false))
  }
  const task = {
    error,
    setError,
    isExecuting,
    setIsExecuting,
    execute,
  }

  return task
}
