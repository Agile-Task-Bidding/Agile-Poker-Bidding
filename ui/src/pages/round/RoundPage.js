import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { connectedToRoomSelector } from '../../data/state/room-service/room-service.selectors';
import { createRoomServiceConnection } from '../../data/state/room-service/room-service.actions';
import { setRoundState } from '../../data/state/round-state/round-state.actions';
import ResponsiveContainer from '../../components/ResponsiveContainer'
import RoundSubpage from './RoundSubpage'
import { useHistory, useParams } from 'react-router-dom';
import DisplayNameSubpage from './DisplayNameSubpage';
import { appStateSelector } from '../../data/state/app-data/app-data.selector';
import { setAppState, setDisplayName } from '../../data/state/app-data/app-data.actions';
import { setRickRollPlaying } from '../../data/state/rick-rolled/rick-rolled.actions';
import AppState from '../../services/AppState';
import KickedSubpage from './KickedSubpage';
import ClosedSubpage from './ClosedSubpage';
import InactiveSubpage from './InactiveSubpage';
import { Typography } from '@material-ui/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import { loginUser } from '../../services/login';

const RoundPage = ({ appState, setAppState, setDisplayName, setRoundState, setRickRollPlaying, createRoomServiceConnection }) => {

  const history = useHistory();

  useEffect(() => {
    (async () => {
      // await firebase
      //   .auth()
      //   .signInWithEmailAndPassword('ryglaspey@knights.ucf.edu', 'password');
      
      loginUser(async (_) => {
        const socket = await createRoomServiceConnection()
        console.log(socket)
        socket.on('connect', () => {
          console.log('Connected!');
        });
        socket.on('disconnect', () => {
            console.log('Disconnected');
            setDisplayName('');
        });
        socket.on('room_inactive', event => setAppState(AppState.ROOM_INACTIVE));
        socket.on('kicked', event => setAppState(AppState.KICKED_FROM_ROOM));
        socket.on('user_already_in_room', console.log);
        socket.on('room_state_changed', event => setRoundState(event.roomState));
        socket.on('join_success', event => setAppState(AppState.CONNECTED_TO_ROOM));
        socket.on('not_in_room_error', event => console.log);
        socket.on('vote_success', event => console.log);
        socket.on('vote_cancel_success', event => console.log);
        socket.on('room_already_created', event => console.log);
        socket.on('create_success', event => console.log);
        socket.on('host_room_closed_failure', event => console.log);
        socket.on('host_closed_connection', event => setAppState(AppState.ROOM_CLOSED));
        socket.on('host_room_closed_success', event => console.log);
        socket.on('rickroll', () => setRickRollPlaying(true));
      });
    })()
  }, [])

  const renderSubpage = () => {
    if (appState === AppState.CONNECTED_TO_ROOM) {
      return <RoundSubpage/>
    }
    if (appState === AppState.KICKED_FROM_ROOM) {
      return <KickedSubpage/>
    }
    if (appState === AppState.PICK_DISPLAY_NAME) {
      return <DisplayNameSubpage/>
    }
    if (appState === AppState.ROOM_CLOSED) {
      return <ClosedSubpage/>
    }
    if (appState === AppState.ROOM_INACTIVE) {
      return <InactiveSubpage/>
    }
    return <Typography>Invalid State. Rip</Typography>
  }

  return (
    <ResponsiveContainer>
      {renderSubpage()}
    </ResponsiveContainer>
  )
}

const mapStateToProps = (state) => {
    return {
        appState: appStateSelector(state),
    }
}

const mapDispatchToProps = {
  createRoomServiceConnection,
  setAppState,
  setDisplayName,
  setRoundState,
  setRickRollPlaying,
}

export default connect(mapStateToProps, mapDispatchToProps)(RoundPage)
