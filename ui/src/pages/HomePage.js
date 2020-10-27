import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Typography } from '@material-ui/core'
import { StyleSheet, css } from 'aphrodite'
import { globalSocketSelector } from '../data/state/global-socket/global-socket.selectors'
import { createGlobalSocket } from '../data/state/global-socket/global-socket.actions'

class HomePage extends Component {
  state = {}

  componentDidMount() {
    this.props.createGlobalSocket()
  }

  sendClientInfo() {
    if (this.props.globalSocket) {
      this.props.globalSocket.emit('client_info', {
        name: 'Billy Bob',
        greeting: 'Hi everyone!',
      })
    } else {
      console.log('No global socket found!')
    }
  }

  render() {
    return (
      <>
        <Typography variant='h5' className={css(styles.headerText)}>
          Hi!
        </Typography>
        <Button onClick={() => this.sendClientInfo()}>
          Click for Socket.io Emit!
        </Button>
      </>
    )
  }
}

const styles = StyleSheet.create({
  headerText: {
    color: 'blue',
    background: 'red',
  },
})

const mapStateToProps = (state) => {
  return {
    globalSocket: globalSocketSelector(state),
  }
}

const mapDispatchToProps = {
  createGlobalSocket,
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)
