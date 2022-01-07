import BuildIcon from '@mui/icons-material/Build'
import CreateIcon from '@mui/icons-material/Create'
import Backdrop from '@mui/material/Backdrop'
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import { makeStyles } from '@mui/styles'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: 'none',
    color: theme.palette.text.secondary,
  },
}))

const WithLink: React.FC<{ to: string }> = ({ to, children }) => {
  const classes = useStyles()
  return (
    <Link className={classes.link} to={to}>
      {children}
    </Link>
  )
}

const actions = [
  {
    icon: (
      <WithLink to="/practice_records/new">
        <CreateIcon />
      </WithLink>
    ),
    name: '走行を記録',
  },
  {
    icon: (
      <WithLink to="/maintenance_records/new">
        <BuildIcon />
      </WithLink>
    ),
    name: '整備を記録',
  },
]

const BasicSpeedDial: React.FC = () => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <Backdrop open={open} />
      <SpeedDial
        ariaLabel="additional-speed-dial"
        sx={{ top: 'auto', position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
          />
        ))}
      </SpeedDial>
    </>
  )
}

export default BasicSpeedDial
