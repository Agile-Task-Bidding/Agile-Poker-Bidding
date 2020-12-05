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
import * as RoomService from '../services/RoomService';

const RoundPage = ({ appState, loginUser, setAppState, setDisplayName, setRoundState, setRickRollPlaying, createRoomServiceConnection, emitEvent }) => {

  const history = useHistory();
  const { username } = useParams();

  let onConnect;
  let onDisconnect;
  let onRoomInactive;
  let onHostClosedConnection;
  let onUserAlreadyInRoom;
  let onRoomStateChanged;
  let onJoinSuccess;
  let onNotInRoomError;
  let onVoteSuccess;
  let onVoteCancelSuccess;
  let onCreateSuccess;
  let onHostRoomClosedFailure;
  let onHostRoomClosedSuccess;
  let onRickroll;
  let onRoomStatusFetched;

  const registerSocketEvents = (socket) => {
    onConnect = RoomService.onConnect(socket, () => { console.log('Connected!'); });
    onDisconnect = RoomService.onDisconnect(socket, () => { console.log('Disconnected'); });
    onRoomInactive = RoomService.onRoomInactive(socket, () => { setAppState(AppState.ROOM_INACTIVE); })
    onHostClosedConnection = RoomService.onHostClosedConnection(socket, () => { 
      setDisplayName(''); 
      setAppState(AppState.KICKED_FROM_ROOM); 
    });
    onUserAlreadyInRoom = RoomService.onUserAlreadyInRoom(socket, console.log);
    onRoomStateChanged = RoomService.onRoomStateChanged(socket, (roomState) => setRoundState(roomState));
    onJoinSuccess = RoomService.onJoinSuccess(socket, () => setAppState(AppState.CONNECTED_TO_ROOM));
    onNotInRoomError = RoomService.onNotInRoomError(socket, console.log);
    onVoteSuccess = RoomService.onVoteSuccess(socket, console.log);
    onVoteCancelSuccess = RoomService.onVoteCancelSuccess(socket, console.log);
    onCreateSuccess = RoomService.onCreateSuccess(socket, console.log);
    onHostRoomClosedFailure = RoomService.onHostRoomClosedFailure(socket, console.log);
    onHostRoomClosedSuccess = RoomService.onHostRoomClosedSuccess(socket, () => { 
      setDisplayName(''); 
      setAppState(AppState.ROOM_CLOSED) 
    });
    onRoomStatusFetched = RoomService.onRoomStatusFetched(socket, (status) => {
      if (status === 'INACTIVE') {
        setAppState(AppState.ROOM_INACTIVE)          
      }
    })
    socket.on('rickroll', onRickroll);
  }

  const unregisterSocketEvents = (socket) => {
    onConnect.off();
    onDisconnect.off();
    onRoomInactive.off();
    onHostClosedConnection.off();
    onUserAlreadyInRoom.off();
    onRoomStateChanged.off();
    onJoinSuccess.off();
    onNotInRoomError.off();
    onVoteSuccess.off();
    onVoteCancelSuccess.off();
    onCreateSuccess.off();
    onHostRoomClosedFailure.off();
    onHostRoomClosedSuccess.off();
    onRoomStatusFetched.off();
    socket.off('rickroll', onRickroll);
  }

  useEffect(() => {
    (async () => {      
      loginUser(async (_) => {
        const socket = await createRoomServiceConnection()

        RoomService.emitIsRoomOpen(socket, username);

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
