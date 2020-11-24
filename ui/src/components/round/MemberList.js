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

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginRight: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}))

const MemberList = ({ roundState, account, className, ...thruProps }) => {
  const players = Object.values(roundState.connectedUsersByID).map(
    ({ nickname, socketID }) => {
      const vote = roundState.voteByUserID[socketID]
      return (
        <>
          <ListItem>
            <MemberRow
              key={socketID}
              displayName={nickname}
              socketID={socketID}
              voted={vote !== null}
            />
          </ListItem>
          <Divider />
        </>
      )
    }
  )
  const classes = useStyles()
  return (
    <div>
      <Drawer
        {...thruProps}
        className={classes.drawer}
        variant='permanent'
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor='right'
      >
        <div className={classes.toolbar} />

        <List>
          {players}
          {/* <Divider /> */}
        </List>
      </Drawer>
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
