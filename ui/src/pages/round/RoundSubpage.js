import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { roomServiceSocketSelector } from '../../data/state/room-service/room-service.selectors';
import {
  createRoomServiceConnection,
  emitEvent,
} from '../../data/state/room-service/room-service.actions';
import { StyleSheet, css } from 'aphrodite';
import { useParams } from 'react-router-dom';
import { displayNameSelector } from '../../data/state/app-data/app-data.selector';
import { roomConfigSelector } from '../../data/state/room-config/room-config.selector';
import { roundStateSelector } from '../../data/state/round-state/round-state.selector';
import DisplayCard from '../../components/round/DisplayCard'
import EditCardGrid from '../../components/EditCardGrid'
import GameState from '../../services/GameState';
import { Dialog, Typography, Button } from '@material-ui/core';
import RickRolled from '../../components/round/RickRolled';
import MemberRow from '../../components/round/MemberRow';
import MemberList from '../../components/round/MemberList';
import DesktopView from '../../components/round/DesktopView';
import { useMediaQuery } from '@material-ui/core';
import MobileView from '../../components/round/MobileView';

const RoundSubpage = ({ createRoomServiceConnection, displayName, roomConfig, roundState, roomServiceSocket, emitEvent, ...thruProps }) => {

    const { username } = useParams();
    const isDesktop = useMediaQuery('(min-width:600px)');

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
      const voted = Object.values(roundState.connectedUsersByID).filter(({ socketID }) => roundState.voteByUserID[socketID] != null).length;
      const total = Object.values(roundState.connectedUsersByID).length;
      return (
        <>
          <RickRolled/>
          { isDesktop ? (
            <DesktopView
            primary={
              <EditCardGrid>
                {cardUi}
              </EditCardGrid>
            }
            secondary={(
              <MemberList className={css(styles.container)}/>
            )}
          />
          ) : (
            <MobileView
            primary={
              <EditCardGrid>
                {cardUi}
              </EditCardGrid>
            }
            secondary={(
              <MemberList className={css(styles.container)}/>
            )}
            buttonText={`${voted}/${total}`}
          />
          )}
        </>
      )
    }

    const renderResultsPhase = () => {
      const players = Object.values(roundState.connectedUsersByID).map(({ nickname, socketID }) => {
        const vote = roundState.voteByUserID[socketID];
        return (
          <Typography>{nickname}:{vote}</Typography>
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

const styles = StyleSheet.create({
  container: {
    padding: 12,
  }
})

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