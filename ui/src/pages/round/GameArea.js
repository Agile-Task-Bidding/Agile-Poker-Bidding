import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { roomServiceSocketSelector } from '../../data/state/room-service/room-service.selectors';
import { createRoomServiceConnection } from '../../data/state/room-service/room-service.actions';
import { useParams } from 'react-router-dom';
import { displayNameSelector } from '../../data/state/display-name/display-name.selector';
import { roomConfigSelector } from '../../data/state/room-config/room-config.selector';
import { roundStateSelector } from '../../data/state/round-state/round-state.selector';

const GameArea = ({ createRoomServiceConnection, displayName, roomServiceSocket, ...thruProps }) => {

    const { username } = useParams();

    const [state, setState] = useState(''); 

    useEffect(() => {
        (async ()=>{
            const socket = await createRoomServiceConnection();
            console.log(socket);

            socket.on('user_joined', event => console.log('user joined'));
            socket.on('user_disconnected', event => console.log('user disconnected'));
        })()
    }, []);

    return <div>HI {displayName}</div>
};

const mapStateToProps = (state) => {
    return {
      roomServiceSocket: roomServiceSocketSelector(state),
      displayName: displayNameSelector(state),
      roundState: roundStateSelector(state),
      roomConfig: roomStateSelector(state),
    }
  };
  
  const mapDispatchToProps = {
    createRoomServiceConnection
  }
  

export default connect(mapStateToProps, mapDispatchToProps)(GameArea);