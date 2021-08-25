import React from 'react'
import InnerLoading from './InnerLoading'
import Loading from './Loading'

interface HandleFetchProps {
  loading: boolean
  inner?: boolean
  error?: string
}

interface ErrorProps {
  error: string
  onClose: () => void
}

const Error: React.FC<ErrorProps> = (props) => {
  // TODO:
  return <div {...props}></div>
}

const HandleFetch: React.FC<HandleFetchProps> = ({
  loading,
  error,
  inner,
  children,
}) => {
  const handleClose = () => {
    // TODO: リダイレクト
  }

  const LoadingComponent = inner ? InnerLoading : Loading
  return (
    <>
      <LoadingComponent loading={loading}>{children}</LoadingComponent>
      {error && <Error error={error} onClose={handleClose} />}
    </>
  )
}

export default HandleFetch
