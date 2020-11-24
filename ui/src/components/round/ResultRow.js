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

const ResultRow = ({
  account,
  displayName,
  socketID,
  vote,
  roomServiceSocket,
  ...thruProps
}) => {
  return (
    <div className={css(styles.container)} {...thruProps}>
        <Typography
          style={{
            color: '#223496',
            paddingTop: '5px',
          }}
          variant='h5'
        >
          {displayName}
        </Typography>
        <Typography
          variant='h5'
        >
          {vote}
        </Typography>
    </div>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    // gridTemplateColumns: '2fr 1fr',
    justifyContent: 'space-between',
    width: '100%',
  },
})

const mapStateToProps = (state) => {
  return {
    account: accountSelector(state),
    roomServiceSocket: roomServiceSocketSelector(state),
  }
}

export default connect(mapStateToProps, {})(ResultRow)
