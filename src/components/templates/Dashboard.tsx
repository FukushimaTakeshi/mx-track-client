import AccountCircle from '@mui/icons-material/AccountCircle'
import BuildIcon from '@mui/icons-material/Build'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import CreateIcon from '@mui/icons-material/Create'
import HistoryIcon from '@mui/icons-material/History'
import MenuIcon from '@mui/icons-material/Menu'
import PersonIcon from '@mui/icons-material/Person'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import TimelineIcon from '@mui/icons-material/Timeline'
import TimerIcon from '@mui/icons-material/Timer'
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler'
import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import clsx from 'clsx'
import React, { useContext, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../auth/AuthProvider'
import Restricted from '../../auth/Restricted'
import { useClickInside } from '../../hooks/useClickInside'
import AdditionalSpeedDial from './AdditionalSpeedDial'

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
  nestedList: {
    paddingLeft: theme.spacing(4),
  },
}))

export const Dashboard: React.FC = ({ children }) => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const handleDrawerOpen = () => setOpen(true)
  const handleDrawerClose = () => setOpen(false)
  const clickRef = useRef<HTMLDivElement>(null)
  useClickInside(clickRef, handleDrawerClose)
  const iOS = navigator && /iPad|iPhone|iPod/.test(navigator.userAgent)

  const { currentUser, logout } = useContext(AuthContext)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const handleAccountMenu = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget)
  const handleCloseAccountMenu = () => setAnchorEl(null)

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
            size="large"
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
                size="large"
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
                      <TwoWheelerIcon fontSize="small" />
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
      <SwipeableDrawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
        onClose={handleDrawerClose}
        onOpen={handleDrawerOpen}
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose} size="large">
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <List>
          <Link
            to="/dashboard"
            className={classes.link}
            onClick={handleDrawerClose}
          >
            <ListItem button>
              <ListItemIcon>
                <TimelineIcon />
              </ListItemIcon>
              <ListItemText primary="ダッシュボード" />
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
            to="/maintenance_records/new"
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
            to="/vehicles/?to=maintenance-records"
            className={classes.link}
            onClick={handleDrawerClose}
          >
            <ListItem button>
              <ListItemIcon>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText primary="整備履歴" />
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
        <Restricted onlyAdministrator>
          <Divider />
          <List>
            <ListItem className={classes.link}>
              <ListItemText primary="管理者用メニュー" />
            </ListItem>
            <Restricted to={'edit-vehicles'}>
              <Link
                to="/vehicles/new"
                className={classes.link}
                onClick={handleDrawerClose}
              >
                <ListItem button className={classes.nestedList}>
                  <ListItemText primary="バイク登録" />
                </ListItem>
              </Link>
            </Restricted>
            <Restricted to={'edit-off-road-tracks'}>
              <Link
                to="/regions"
                className={classes.link}
                onClick={handleDrawerClose}
              >
                <ListItem button className={classes.nestedList}>
                  <ListItemText primary="コース一覧" />
                </ListItem>
              </Link>
            </Restricted>
            <Restricted to={'edit-maintenance-menus'}>
              <Link
                to="/maintenances"
                className={classes.link}
                onClick={handleDrawerClose}
              >
                <ListItem button className={classes.nestedList}>
                  <ListItemText primary="メンテナンス項目一覧" />
                </ListItem>
              </Link>
            </Restricted>
          </List>
        </Restricted>
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
      </SwipeableDrawer>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container} ref={clickRef}>
          {React.Children.map(children, (child, index) => (
            <Grid key={index} container spacing={5}>
              <Grid item xs={12}>
                <Paper elevation={0} className={classes.paper}>
                  {child}
                </Paper>
              </Grid>
            </Grid>
          ))}
          <AdditionalSpeedDial />
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  )
}
