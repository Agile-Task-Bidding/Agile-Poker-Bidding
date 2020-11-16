import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom';
import ResponsiveContainer from '../../components/ResponsiveContainer'
import { TextField, Button, CircularProgress } from '@material-ui/core'
import {
    createRoomServiceConnection,
    emitEvent,
} from '../../data/state/room-service/room-service.actions';
import { setDisplayName } from '../../data/state/app-data/app-data.actions';
import { roomServiceSocketSelector } from '../../data/state/room-service/room-service.selectors';
import { displayNameSelector } from '../../data/state/app-data/app-data.selector';
import { setAppState } from '../../data/state/app-data/app-data.actions';

const DisplayNameSubpage = ({ displayName, setDisplayName, roomServiceSocket, emitEvent }) => {

    const { username } = useParams();
    const [formDisplayName, setFormDisplayName] = useState('');

    useEffect(() => {
        const value = localStorage.getItem('displayName')
        if (value) {
            setFormDisplayName(value)
        }
    }, [])

    const submit = async () => {
        localStorage.setItem('displayName', formDisplayName);
        setDisplayName(formDisplayName)
        emitEvent(
            'join_room',
            {
                roomID: username,
                nickname: formDisplayName
            }
        );
    }

    const displayNameInvalid = (formDisplayName.length === 0)
    return (
        <ResponsiveContainer>
            <form
                onSubmit={(event) => {
                        event.preventDefault(); 
                        submit()
                    }
                }>
                <TextField
                    label='Display Name'
                    value={formDisplayName}
                    required
                    error={displayNameInvalid}
                    onChange={event => setFormDisplayName(event.target.value)}
                />
                <Button type='submit' disabled={displayNameInvalid || !!displayName}>
                    Continue
                </Button>
                {
                    !!displayName ? (<CircularProgress/>) : null
                }
            </form>
        </ResponsiveContainer>
    )
}

const mapStateToProps = (state) => {
  return {
    roomServiceSocket: roomServiceSocketSelector(state),
    displayName: displayNameSelector(state),
  }
};

const mapDispatchToProps = {
  createRoomServiceConnection,
  setDisplayName,
  emitEvent,
  setAppState,
}

export default connect(mapStateToProps, mapDispatchToProps)(DisplayNameSubpage)
