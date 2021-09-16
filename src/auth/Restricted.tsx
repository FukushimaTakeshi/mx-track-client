import React, { useContext } from 'react'
import { AuthContext } from './AuthProvider'

type Props = {
  to?: string
  onlyAdministrator?: boolean
}

const Restricted: React.FC<Props> = ({ to, onlyAdministrator, children }) => {
  const { userRole } = useContext(AuthContext)
  const isAllowed = () => {
    if (!userRole) {
      return false
    }
    if (onlyAdministrator) {
      return userRole.roles.includes('administrator')
    } else if (to) {
      return userRole.permissions.includes(to)
    }
    return false
  }

  if (isAllowed()) {
    return <>{children}</>
  }
  // TODO: アクセス不可のcomponent
  return null
}

export default Restricted
