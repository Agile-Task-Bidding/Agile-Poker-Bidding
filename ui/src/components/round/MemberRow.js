import React from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Check, Close } from '@material-ui/icons'
import { StyleSheet, css } from 'aphrodite'
import { Button, Typography, Paper } from '@material-ui/core'
import { accountSelector } from '../../data/state/account/account.selector'
import { roomServiceSocketSelector } from '../../data/state/room-service/room-service.selectors'
import firebase from 'firebase/app'
import 'firebase/auth'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import DeleteIcon from '@material-ui/icons/Delete'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import IconButton from '@material-ui/core/IconButton'
import iconCrown from '../icon/crown.svg'

const MemberRow = ({
  account,
  displayName,
  socketID,
  voted,
  roomServiceSocket,
  ...thruProps
}) => {
  const { username } = useParams()
  const isAdmin = account && account.username === username
  const isHost = account === username

  return (
    <div className={css(styles.container)} {...thruProps}>
      <List dense>
        <ListItem
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <ListItemIcon>
            {voted ? (
              <CheckCircleIcon
                style={{
                  color: '#223496',
                }}
                // fontSize='large'
              />
            ) : (
              <CheckCircleOutlineIcon
                style={{
                  color: '#223496',
                }}
                // fontSize='large'
              />
            )}
          </ListItemIcon>
          <ListItemText primary={<Typography variant='h5'>{displayName}</Typography>} />
          {/* <ListItemIcon>
            <img src={iconCrown} />
          </ListItemIcon> */}

          {isAdmin ? (
            <ListItemSecondaryAction>
              <IconButton
                edge='end'
                onClick={async () => {
                  console.log({
                    idToken: await firebase
                      .auth()
                      .currentUser.getIdToken(false),
                    roomID: username,
                    user: { socketID },
                  })
                  roomServiceSocket.emit('kick_user', {
                    idToken: await firebase
                      .auth()
                      .currentUser.getIdToken(false),
                    roomID: username,
                    user: { socketID },
                  })
                }}
              >
                <ExitToAppIcon
                  edge='end'
                  style={{
                    color: '#223496',
                  }}
                  // fontSize='large'
                />
              </IconButton>
            </ListItemSecondaryAction>
          ) : null}
        </ListItem>
      </List>
    </div>
  )
}

const styles = StyleSheet.create({
  container: {
    // display: 'grid',
    // // gridTemplateColumns: '2fr 1fr',
    // justifyContent: 'flex-start',
    width: '100%',
  },
})

const mapStateToProps = (state) => {
  return {
    account: accountSelector(state),
    roomServiceSocket: roomServiceSocketSelector(state),
  }
}

export default connect(mapStateToProps, {})(MemberRow)
