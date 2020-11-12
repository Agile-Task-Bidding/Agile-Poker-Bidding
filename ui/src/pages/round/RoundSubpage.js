import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { roomServiceSocketSelector } from '../../data/state/room-service/room-service.selectors';
import {
  createRoomServiceConnection,
  emitEvent,
} from '../../data/state/room-service/room-service.actions';
import { useParams } from 'react-router-dom';
import { displayNameSelector } from '../../data/state/app-data/app-data.selector';
import { roomConfigSelector } from '../../data/state/room-config/room-config.selector';
import { roundStateSelector } from '../../data/state/round-state/round-state.selector';
import DisplayCard from './DisplayCard'
import EditCardGrid from '../../components/EditCardGrid'
import GameState from '../../services/GameState';
import { Dialog, Typography, Button } from '@material-ui/core';
import RickRolled from './RickRolled';

const RoundSubpage = ({ createRoomServiceConnection, displayName, roomConfig, roundState, roomServiceSocket, emitEvent, ...thruProps }) => {

    useEffect(() => {
        (async ()=>{
            const socket = await createRoomServiceConnection();
        })()
    }, []);

    const renderBiddingPhase = () => {
      const cardUi = roundState.deck.map((it, idx) => (
        <DisplayCard 
          key={it.number} 
          card={it}
          onClick={()=>{
            emitEvent('user_vote', {
                roomID: 'falc',
                cardIndex: idx,
            })
        }}
        />
      ));
      const players = Object.keys(roundState.voteByUserID).map(id => (
        <Typography variant='body1' key={id}>{id}:{roundState.voteByUserID[id]}</Typography>
      ));
      return (
        <>
          <RickRolled rickRollPlaying={true}/>
          <EditCardGrid>
            {cardUi}
          </EditCardGrid>
          {players}
        </>
      )
    }

    const renderResultsPhase = () => {
      const players = Object.keys(roundState.voteByUserID).map(id => (
        <Typography variant='body1' key={id}>{id}:{roundState.voteByUserID[id]}</Typography>
      ))
      return (
        <>
          {players}
          <Button onClick={() => {
            emitEvent('start_new_round', {roomID: 'falc'})
          }}>Next Round</Button>
        </>
      )
    }

    console.log(roundState)
    return (
      <>
        <RickRolled rickRollPlaying={true}/>
        { roundState.phase === 'RESULTS_PHASE' ? renderResultsPhase() : renderBiddingPhase() }
      </>
    )
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
    createRoomServiceConnection,
    emitEvent,
  }
  

export default connect(mapStateToProps, mapDispatchToProps)(RoundSubpage);