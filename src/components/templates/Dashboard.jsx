import {
  Button,
  Grid,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
} from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import AccountCircle from '@material-ui/icons/AccountCircle'
import BuildIcon from '@material-ui/icons/Build'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import CreateIcon from '@material-ui/icons/Create'
import HistoryIcon from '@material-ui/icons/History'
import MenuIcon from '@material-ui/icons/Menu'
import MotorcycleIcon from '@material-ui/icons/Motorcycle'
import PersonIcon from '@material-ui/icons/Person'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import TimelineIcon from '@material-ui/icons/Timeline'
import TimerIcon from '@material-ui/icons/Timer'
import clsx from 'clsx'
import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../auth/AuthProvider'

const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {`Copyright © MX Track ${new Date().getFullYear()}.`}
    </Typography>
  )
}

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('xs')]: {
      width: theme.spacing(0),
    },
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    //   height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.text.secondary,
  },
  AccountLink: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
  },
}))

export const Dashboard = ({ children }) => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const handleDrawerOpen = () => setOpen(true)
  const handleDrawerClose = () => setOpen(false)
  const { currentUser, logout } = useContext(AuthContext)

  const [anchorEl, setAnchorEl] = useState(null)

  const handleAccountMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseAccountMenu = () => {
    setAnchorEl(null)
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            MX Track
          </Typography>
          {currentUser && (
            <>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleAccountMenu}
                color="inherit"
              >
                <AccountCircle fontSize="large" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleCloseAccountMenu}
              >
                <Link
                  to="/user/edit"
                  className={classes.AccountLink}
                  onClick={handleCloseAccountMenu}
                >
                  <MenuItem>
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                  </MenuItem>
                </Link>
                <Link
                  to="/vehicles/edit"
                  className={classes.AccountLink}
                  onClick={handleCloseAccountMenu}
                >
                  <MenuItem>
                    <ListItemIcon>
                      <MotorcycleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="マイバイク" />
                  </MenuItem>
                </Link>
                <MenuItem onClick={logout}>
                  <ListItemIcon>
                    <span className="material-icons">logout</span>
                  </ListItemIcon>
                  <ListItemText primary="ログアウト" />
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <List>
          <Link
            to="/mypage"
            className={classes.link}
            onClick={handleDrawerClose}
          >
            <ListItem button>
              <ListItemIcon>
                <TimelineIcon />
              </ListItemIcon>
              <ListItemText primary="アクティビティ" />
            </ListItem>
          </Link>
          <Link
            to="/vehicles/?to=maintenance-records"
            className={classes.link}
            onClick={handleDrawerClose}
          >
            <ListItem button>
              <ListItemIcon>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText primary="メンテナンス履歴" />
            </ListItem>
          </Link>
          <Link
            to="/practice_records/new"
            className={classes.link}
            onClick={handleDrawerClose}
          >
            <ListItem button>
              <ListItemIcon>
                <CreateIcon />
              </ListItemIcon>
              <ListItemText primary="走行を記録する" />
            </ListItem>
          </Link>
          <Link
            to="/vehicles/?to=practice-record"
            className={classes.link}
            onClick={handleDrawerClose}
          >
            <ListItem button>
              <ListItemIcon>
                <BuildIcon />
              </ListItemIcon>
              <ListItemText primary="整備を記録する" />
            </ListItem>
          </Link>
          <Link
            to="/vehicles?to=periodic-maintenance"
            className={classes.link}
            onClick={handleDrawerClose}
          >
            <ListItem button>
              <ListItemIcon>
                <TimerIcon />
              </ListItemIcon>
              <ListItemText primary="定期メンテナンス" />
            </ListItem>
          </Link>
        </List>
        <Divider />
        <List>
          {currentUser ? (
            <ListItem button className={classes.link} onClick={logout}>
              <ListItemIcon>
                <span className="material-icons">logout</span>
              </ListItemIcon>
              <ListItemText primary="ログアウト" />
            </ListItem>
          ) : (
            <Link
              to="/login"
              className={classes.link}
              onClick={handleDrawerClose}
            >
              <ListItem>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PersonAddIcon />}
                >
                  ログイン / ユーザー登録
                </Button>
              </ListItem>
            </Link>
          )}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          {React.Children.map(children, (child, index) => (
            <Grid key={index} container spacing={5}>
              <Grid item xs={12}>
                <Paper elevation={0} className={classes.paper}>
                  {child}
                </Paper>
              </Grid>
            </Grid>
          ))}
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  )
}
