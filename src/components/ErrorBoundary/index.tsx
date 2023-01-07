import { Typography } from '@mui/material'
import React, { ErrorInfo } from 'react'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State

  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo)
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <>
          <h3>
            問題が発生しました。
            <br />
            リロードしてください。
          </h3>
          <Typography variant="subtitle2" align="center" component="p">
            エラーが解消しない場合、中の人は気づいていない可能性が高いのでこちらから報告をお願いします！
            <a
              href="https://forms.gle/BpT51ztLTfufLVov5"
              target="_blank"
              rel="noreferrer"
            >
              お問い合わせ
            </a>
          </Typography>
        </>
      )
    }

    return this.props.children
  }
}
