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

  return (
    <div className={css(styles.container)} {...thruProps}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        {voted ? (
          <CheckCircleIcon
            style={{
              color: '#223496',
            }}
            fontSize='large'
          />
        ) : (
          <CheckCircleOutlineIcon
            style={{
              color: '#223496',
            }}
            fontSize='large'
          />
        )}
        <Typography
          style={{
            color: '#223496',
            paddingTop: '5px',
          }}
          variant='h5'
        >
          {displayName}
        </Typography>
      </div>
      {isAdmin ? (
        <Button
          onClick={async () => {
            console.log({
              idToken: await firebase.auth().currentUser.getIdToken(false),
              roomID: username,
              user: { socketID },
            })
            roomServiceSocket.emit('kick_user', {
              idToken: await firebase.auth().currentUser.getIdToken(false),
              roomID: username,
              user: { socketID },
            })
          }}
        >
          <DeleteIcon
            style={{
              color: '#223496',
            }}
            fontSize='large'
          />
        </Button>
      ) : null}
    </div>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'grid',
    // gridTemplateColumns: '2fr 1fr',
    justifyContent: 'flex-start',
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
