import React, { useState, useEffect } from 'react'
import mainImg from '../../components/icon/logo.svg'
import { connect } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import ResponsiveContainer from '../../components/ResponsiveContainer'
import { TextField, Button, CircularProgress } from '@material-ui/core'
import {
  createRoomServiceConnection,
  emitEvent,
} from '../../data/state/room-service/room-service.actions'
import { setDisplayName } from '../../data/state/app-data/app-data.actions'
import { roomServiceSocketSelector } from '../../data/state/room-service/room-service.selectors'
import { displayNameSelector } from '../../data/state/app-data/app-data.selector'
import { setAppState } from '../../data/state/app-data/app-data.actions'
import { Typography } from '@material-ui/core'
import * as RoomService from '../../services/RoomService'

const DisplayNameSubpage = ({
  displayName,
  setDisplayName,
  roomServiceSocket,
  emitEvent,
}) => {
  const { username } = useParams()
  const [formDisplayName, setFormDisplayName] = useState('')

  useEffect(() => {
    const value = localStorage.getItem('displayName')
    if (value) {
      setFormDisplayName(value)
    }
  }, [])

  const submit = async () => {
    localStorage.setItem('displayName', formDisplayName)
    setDisplayName(formDisplayName)
    RoomService.emitJoinRoom(roomServiceSocket, username, formDisplayName)
  }

  const displayNameInvalid = formDisplayName.length === 0
  return (
    <div className='App '>
      <div className='radiant-background'>
        <div className='login'>
          <div className='container'>
            <div className='base-container'>
              <div className='content'>
                <div className='image' style={{ marginTop: 30 }}>
                  <img src={mainImg} />
                </div>
                <Typography
                  variant='h1'
                  color='primary'
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  PilePlan
                </Typography>
                <form
                  onSubmit={(event) => {
                    event.preventDefault()
                    submit()
                  }}
                >
                  <div style={{ marginTop: 30 }}>
                    <Typography variant='h6' color='primary'>
                      You are joining{' '}
                      {username.charAt(0).toUpperCase() + username.slice(1)}'s
                      room!
                    </Typography>
                    <Typography variant='h6' color='primary'>
                      Enter a nickname to Join
                    </Typography>
                    <TextField
                      variant='filled'
                      margin='dense'
                      validators={['required']}
                      // errorMessages={['Display Name is required']}
                      InputProps={{ disableUnderline: true }}
                      fullWidth
                      label='Nickname'
                      value={formDisplayName}
                      required
                      error={displayNameInvalid}
                      onChange={(event) =>
                        setFormDisplayName(event.target.value)
                      }
                      style={{ marginTop: 30, marginBottom: 0 }}
                    />
                    <Button
                      variant='contained'
                      color='primary'
                      fullWidth
                      style={{
                        fontSize: 15,
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0,
                      }}
                      type='submit'
                      disabled={displayNameInvalid || !!displayName}
                    >
                      Join
                    </Button>
                  </div>
                  {!!displayName ? <CircularProgress /> : null}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    roomServiceSocket: roomServiceSocketSelector(state),
    displayName: displayNameSelector(state),
  }
}

const mapDispatchToProps = {
  createRoomServiceConnection,
  setDisplayName,
  emitEvent,
  setAppState,
}

export default connect(mapStateToProps, mapDispatchToProps)(DisplayNameSubpage)
