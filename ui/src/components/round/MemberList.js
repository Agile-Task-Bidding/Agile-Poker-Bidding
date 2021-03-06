import React from 'react'
import { connect } from 'react-redux'
import { accountSelector } from '../../data/state/account/account.selector'
import MemberRow from './MemberRow'
import { roundStateSelector } from '../../data/state/round-state/round-state.selector'
import { StyleSheet, css } from 'aphrodite'
import { Paper, List, ListItem, Typography } from '@material-ui/core'
import Drawer from '@material-ui/core/Drawer'
import { makeStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import mainLogo from '../icon/logo.svg'
import Hidden from '@material-ui/core/Hidden'
import CssBaseline from '@material-ui/core/CssBaseline'

import Toolbar from '@material-ui/core/Toolbar'

// const drawerWidth = 240

// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: 'flex',
//   },
//   appBar: {
//     width: `calc(100% - ${drawerWidth}px)`,
//     marginRight: drawerWidth,
//   },
//   drawer: {
//     width: drawerWidth,
//     flexShrink: 0,
//   },
//   drawerPaper: {
//     width: drawerWidth,
//   },
//   // necessary for content to be below app bar
//   toolbar: theme.mixins.toolbar,
//   content: {
//     flexGrow: 1,
//     backgroundColor: theme.palette.background.default,
//     padding: theme.spacing(3),
//   },
// }))

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      zIndex: theme.zIndex.drawer - 1,
    },
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  usersHeader: {
    padding: 12,
    marginTop: 2,
  }
}))

const MemberList = ({ roundState, account, className, mobileDrawerOpen, onClose, ...thruProps }) => {
  const players = Object.values(roundState.connectedUsersByID).map(
    ({ nickname, socketID }) => {
      const vote = roundState.voteByUserID[socketID]
      return (
        <React.Fragment key={socketID}>
          <ListItem>
            <MemberRow
              displayName={nickname}
              socketID={socketID}
              voted={vote !== null}
              isHost={(socketID === roundState.hostSocketID)}
            />
          </ListItem>
          <Divider/>
        </React.Fragment>
      )
    }
  )
  const classes = useStyles()
  const { window } = thruProps
  const container =
    window !== undefined ? () => window().document.body : undefined

  return (
    <div className={classes.root}>
      <CssBaseline />
      <div className={classes.toolbar}/>

      <Hidden smUp implementation='css'>
        <Drawer
          {...thruProps}
          className={classes.drawer}
          container={container}
          variant='temporary'
          anchor='right'
          open={mobileDrawerOpen}
          onClose={onClose}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <Typography variant='h4' className={classes.usersHeader}>Users</Typography>
          <Divider/>
          <div className={classes.drawerContainer}>
            <List>{players}</List>
          </div>
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation='css'>
        <Drawer
          {...thruProps}
          className={classes.drawer}
          container={container}
          anchor='right'
          classes={{
            paper: classes.drawerPaper,
          }}
          variant='permanent'
          open
        >
          <Typography variant='h4' className={classes.usersHeader}>Users</Typography>
          <Divider/>
          <div className={classes.drawerContainer}>
            <List>{players}</List>
          </div>
        </Drawer>
      </Hidden>
    </div>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    // padding: 12,
    margin: '0',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginRight: drawerWidth,
  },
})

const mapStateToProps = (state) => {
  return {
    roundState: roundStateSelector(state),
    account: accountSelector(state),
  }
}

export default connect(mapStateToProps, {})(MemberList)
