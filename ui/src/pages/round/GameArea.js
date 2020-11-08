import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { roomServiceSocketSelector } from '../../data/state/room-service/room-service.selectors';
import { createRoomServiceConnection } from '../../data/state/room-service/room-service.actions';
import { useParams } from 'react-router-dom';
import { displayNameSelector } from '../../data/state/app-data/app-data.selector';
import { roomConfigSelector } from '../../data/state/room-config/room-config.selector';
import { roundStateSelector } from '../../data/state/round-state/round-state.selector';
import DisplayCard from './DisplayCard'
import EditCardGrid from '../../components/EditCardGrid'
import GameState from '../../services/GameState';
import { Dialog } from '@material-ui/core';
import RickRolled from './RickRolled';
const GameArea = ({ createRoomServiceConnection, displayName, roomConfig, roundState, roomServiceSocket, ...thruProps }) => {

    useEffect(() => {
        (async ()=>{
            const socket = await createRoomServiceConnection();
        })()
    }, []);

    const cardUi = roomConfig.deck.map(it => <DisplayCard key={it.value} card={it}/>)
    return roundState.state === GameState.BIDDING ? (
      <>
        <RickRolled rickRollPlaying={true}/>
        <EditCardGrid>
          {cardUi}
        </EditCardGrid>
      </>
    ) : null
};

const mapStateToProps = (state) => {
    return {
      roomServiceSocket: roomServiceSocketSelector(state),
      displayName: displayNameSelector(state),
      roundState: roundStateSelector(state),
      roomConfig: roomConfigSelector(state),
    }
  };
  
  const mapDispatchToProps = {
    createRoomServiceConnection
  }
  

export default connect(mapStateToProps, mapDispatchToProps)(GameArea);