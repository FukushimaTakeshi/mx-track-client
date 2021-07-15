import React from 'react'
import InnerLoading from './InnerLoading'
import Loading from './Loading'

const Error = (props) => {
  // TODO:
  return <div {...props}></div>
}

const HandleFetch = ({ loading, error, inner, children }) => {
  const handleClose = () => {
    // TODO:
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
