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
import MemberRow from './MemberRow';

const RoundSubpage = ({ createRoomServiceConnection, displayName, roomConfig, roundState, roomServiceSocket, emitEvent, ...thruProps }) => {

    const { username } = useParams();

    const renderBiddingPhase = () => {
      const picked = roundState.voteByUserID[roomServiceSocket.id]
      console.log(roomServiceSocket.id)
      console.log(picked)
      const cardUi = roundState.deck.map((it, idx) => (
        <DisplayCard 
          key={it.number} 
          card={it}
          selected={idx==picked}
          onClick={()=>{
            console.log('user_vote', {
                roomID: username,
                cardIndex: idx,
            })
            emitEvent('user_vote', {
                roomID: username,
                cardIndex: idx,
            })
        }}
        />
      ));
      const players = Object.values(roundState.connectedUsersByID).map(({ nickname, socketID }) => {
        const vote = roundState.voteByUserID[socketID];
        return (
          <MemberRow displayName={nickname} vote={vote}/>
        )
      });
      return (
        <>
          <RickRolled/>
          <EditCardGrid>
            {cardUi}
          </EditCardGrid>
          {players}
        </>
      )
    }

    const renderResultsPhase = () => {
      const players = Object.values(roundState.connectedUsersByID).map(({ nickname, socketID }) => {
        const vote = roundState.voteByUserID[socketID];
        return (
          <MemberRow displayName={nickname} vote={vote}/>
        )
      });
      return (
        <>
          {players}
          <Button onClick={() => {
            emitEvent('start_new_round', {roomID: username})
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