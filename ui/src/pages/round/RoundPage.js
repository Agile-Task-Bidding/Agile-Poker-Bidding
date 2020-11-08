import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { connectedToRoomSelector } from '../../data/state/room-service/room-service.selectors';
import { createRoomServiceConnection } from '../../data/state/room-service/room-service.actions';
import ResponsiveContainer from '../../components/ResponsiveContainer'
import GameArea from './GameArea'
import { useHistory, useParams } from 'react-router-dom';
import DisplayNameSection from './DisplayNameSection';

const RoundPage = ({ connectedToRoom, createRoomServiceConnection }) => {
  // connectedToRoom = true

  useEffect(() => {
    createRoomServiceConnection()
  }, [])

  return (
    <ResponsiveContainer>
      { connectedToRoom ? (
        <GameArea/>
        ) : (
        <DisplayNameSection/>
      )}
    </ResponsiveContainer>
  )
}

const mapStateToProps = (state) => {
    return {
        connectedToRoom: connectedToRoomSelector(state)
    }
}

const mapDispatchToProps = {
  createRoomServiceConnection,
}

export default connect(mapStateToProps, mapDispatchToProps)(RoundPage)
