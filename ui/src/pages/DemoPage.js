import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Typography, TextField } from '@material-ui/core'
import { StyleSheet, css } from 'aphrodite'
import { roomServiceSocketSelector } from '../data/state/room-service/room-service.selectors'
import {
  createRoomServiceConnection,
  joinRoom,
} from '../data/state/room-service/room-service.actions'

class DemoPage extends Component {
  state = {
    roomID: '',
    username: '',
  }

  async componentDidMount() {
    await this.props.createRoomServiceConnection()
    this.props.roomServiceSocket.on('user_joined', (event) =>
      this.onUserJoined(event)
    )
    this.props.roomServiceSocket.on('user_disconnected', (event) =>
      this.onUserDisconnected(event)
    )
  }

  onUserJoined(event) {
    console.log(event.username + ' has joined the room!')
  }

  onUserDisconnected(event) {
    console.log(event.username + ' has disconnected from the room!')
  }

  render() {
    return (
      <>
        <TextField
          placeholder={'Room ID'}
          value={this.state.roomID}
          onChange={(event) => this.setState({ roomID: event.target.value })}
        />
        <TextField
          placeholder={'Username'}
          value={this.state.username}
          onChange={(event) => this.setState({ username: event.target.value })}
        />
        <Button
          onClick={() =>
            this.props.joinRoom(this.state.roomID, this.state.username)
          }
        >
          Join Room
        </Button>
      </>
    )
  }
}

const styles = StyleSheet.create({})

const mapStateToProps = (state) => {
  return {
    roomServiceSocket: roomServiceSocketSelector(state),
  }
}

const mapDispatchToProps = {
  createRoomServiceConnection,
  joinRoom,
}

export default connect(mapStateToProps, mapDispatchToProps)(DemoPage)
