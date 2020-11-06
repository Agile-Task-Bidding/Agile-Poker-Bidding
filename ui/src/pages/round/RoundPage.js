import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { displayNameSelector } from '../../data/state/display-name/display-name.selector';
import ResponsiveContainer from '../../components/ResponsiveContainer'
import GameArea from './GameArea'
import { useHistory, useParams } from 'react-router-dom';

const RoundPage = ({ displayName }) => {

    const { username } = useParams();
    const history = useHistory();

    useEffect(() => {
        if (!displayName) {
            history.push(`/enter/room/${username}`)
        }
    }, [])

  return (
    <ResponsiveContainer>
      <GameArea/>
    </ResponsiveContainer>
  )
}

const mapStateToProps = (state) => {
    return {
        displayName: displayNameSelector(state)
    }
}

export default connect(mapStateToProps)(RoundPage)
