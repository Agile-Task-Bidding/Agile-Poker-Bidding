import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { connectedToRoomSelector } from '../data/state/room-service/room-service.selectors';
import { createRoomServiceConnection, emitEvent } from '../data/state/room-service/room-service.actions';
import { setRoundState } from '../data/state/round-state/round-state.actions';
import ResponsiveContainer from '../components/ResponsiveContainer'
import RoundSubpage from './round/RoundSubpage'
import { useHistory, useParams } from 'react-router-dom';
import DisplayNameSubpage from './round/DisplayNameSubpage';
import { setAccount } from '../data/state/account/account.actions'
import { appStateSelector } from '../data/state/app-data/app-data.selector';
import { setAppState, setDisplayName } from '../data/state/app-data/app-data.actions';
import { setRickRollPlaying } from '../data/state/rick-rolled/rick-rolled.actions';
import AppState from '../services/AppState';
import KickedSubpage from './round/KickedSubpage';
import ClosedSubpage from './round/ClosedSubpage';
import InactiveSubpage from './round/InactiveSubpage';
import { Typography } from '@material-ui/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import { loginUser } from '../data/state/account/account.actions';

const RoundPage = ({ appState, loginUser, setAppState, setDisplayName, setRoundState, setRickRollPlaying, createRoomServiceConnection, emitEvent }) => {

  const history = useHistory();
  const { username } = useParams();

  const onConnect = () => {console.log('Connected!');};
  const onDisconnect = () => {console.log('Disconnected');};
  const onRoomInactive = event => { setAppState(AppState.ROOM_INACTIVE) };
  const onHostClosedConnection = event => { setDisplayName(''); setAppState(AppState.KICKED_FROM_ROOM) };
  const onUserAlreadyInRoom = console.log;
  const onRoomStateChanged = event => setRoundState(event.roomState);
  const onJoinSuccess = event => setAppState(AppState.CONNECTED_TO_ROOM);
  const onNotInRoomError = event => console.log;
  const onVoteSuccess = event => console.log;
  const onVoteCancelSuccess = event => console.log;
  const onCreateSuccess = event => console.log;
  const onHostRoomClosedFailure = event => console.log;
  const onHostRoomClosedSuccess = event => { setDisplayName(''); setAppState(AppState.ROOM_CLOSED) };
  const onRickroll = () => setRickRollPlaying(true);
  const onRoomStatusFetched = (event) => {
    console.log(event);
    if (event.status === 'INACTIVE') {
      console.log('inactive', event.status);
      setAppState(AppState.ROOM_INACTIVE)          
    }
  }

  const registerSocketEvents = (socket) => {
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('room_inactive', onRoomInactive);
    socket.on('host_closed_connection', onHostClosedConnection);
    socket.on('user_already_in_room', onUserAlreadyInRoom);
    socket.on('room_state_changed', onRoomStateChanged);
    socket.on('join_success', onJoinSuccess);
    socket.on('not_in_room_error', onNotInRoomError);
    socket.on('vote_success', onVoteSuccess);
    socket.on('vote_cancel_success', onVoteCancelSuccess);
    socket.on('create_success', onCreateSuccess);
    socket.on('host_room_closed_failure', onHostRoomClosedFailure);
    socket.on('host_room_closed_success', onHostRoomClosedSuccess);
    socket.on('rickroll', onRickroll);
    socket.on('room_status_fetched', onRoomStatusFetched)
  }

  const unregisterSocketEvents = (socket) => {
    socket.off('connect', onConnect);
    socket.off('disconnect', onDisconnect);
    socket.off('room_inactive', onRoomInactive);
    socket.off('host_closed_connection', onHostClosedConnection);
    socket.off('user_already_in_room', onUserAlreadyInRoom);
    socket.off('room_state_changed', onRoomStateChanged);
    socket.off('join_success', onJoinSuccess);
    socket.off('not_in_room_error', onNotInRoomError);
    socket.off('vote_success', onVoteSuccess);
    socket.off('vote_cancel_success', onVoteCancelSuccess);
    socket.off('create_success', onCreateSuccess);
    socket.off('host_room_closed_failure', onHostRoomClosedFailure);
    socket.off('host_room_closed_success', onHostRoomClosedSuccess);
    socket.off('rickroll', onRickroll);
    socket.off('room_status_fetched', onRoomStatusFetched)
  }

  useEffect(() => {
    (async () => {      
      loginUser(async (_) => {
        const socket = await createRoomServiceConnection()

        emitEvent('is_room_open', { roomID: username });

        registerSocketEvents(socket);
        return () => { unregisterSocketEvents(socket); };
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

  return renderSubpage()
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
  loginUser,
  emitEvent,
}

export default connect(mapStateToProps, mapDispatchToProps)(RoundPage)
