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
import CardGrid from '../../components/CardGrid'
import GameState from '../../services/GameState';
import { Dialog, Typography, Button, Paper, Container } from '@material-ui/core';
import RickRolled from '../../components/round/RickRolled';
import MemberRow from '../../components/round/MemberRow';
import MemberList from '../../components/round/MemberList';
import DesktopView from '../../components/round/DesktopView';
import { useMediaQuery } from '@material-ui/core';
import MobileView from '../../components/round/MobileView';
import ResultsList from '../../components/round/ResultsList';

const RoundSubpage = ({ createRoomServiceConnection, displayName, roomConfig, roundState, roomServiceSocket, emitEvent, ...thruProps }) => {

    const { username } = useParams();
    const isDesktop = useMediaQuery('(min-width:600px)');

    const renderBiddingPhase = () => {
      const picked = roundState.voteByUserID[roomServiceSocket.id]
      const cardUi = roundState.deck.map((it, idx) => (
        <DisplayCard 
          key={it.number} 
          card={it}
          selected={idx==picked}
          onClick={()=>{
            emitEvent('user_vote', {
                roomID: username,
                cardIndex: idx,
            })
        }}
        />
      ));
      const voted = Object.values(roundState.connectedUsersByID).filter(({ socketID }) => roundState.voteByUserID[socketID] != null).length;
      const total = Object.values(roundState.connectedUsersByID).length;
      return (
        <>
          <RickRolled/>
          { isDesktop ? (
            <DesktopView
            header={
              <Paper square>
                <Typography variant='h2'>Place your bid</Typography>
              </Paper>
            }
            primary={
              <CardGrid className={css(styles.cardArea)}>
                {cardUi}
              </CardGrid>
            }
            secondary={(
              <MemberList className={css(styles.container)}/>
            )}
          />
          ) : (
            <MobileView
              primary={
                <CardGrid>
                  {cardUi}
                </CardGrid>
              }
              secondary={(
                <MemberList/>
              )}
              buttonText={`${voted}/${total}`}
            />
          )}
        </>
      )
    }

    const renderResultsPhase = () => {
      return (
        <Container>
          <Paper>
            <Typography variant='h2' style={{ marginBottom: 24 }}>Results</Typography>
          </Paper>
          <ResultsList/>
          <Button onClick={() => {
            emitEvent('start_new_round', {roomID: username})
          }}>Next Round</Button>
        </Container>
      )
    }

    return (
      <>
        <RickRolled rickRollPlaying={true}/>
        { roundState.phase === 'RESULTS_PHASE' ? renderResultsPhase() : renderBiddingPhase() }
      </>
    )
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 12,
  },
  cardArea: {
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