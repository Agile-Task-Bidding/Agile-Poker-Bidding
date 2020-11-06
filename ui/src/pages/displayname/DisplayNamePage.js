import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom';
import ResponsiveContainer from '../../components/ResponsiveContainer'
import { TextField, Button } from '@material-ui/core'
import {
    createRoomServiceConnection,
    joinRoom,
} from '../../data/state/room-service/room-service.actions';
import { setDisplayName } from '../../data/state/display-name/display-name.actions';
import { roomServiceSocketSelector } from '../../data/state/room-service/room-service.selectors';
import { displayNameSelector } from '../../data/state/display-name/display-name.selector';

const DisplayNamePage = ({ setDisplayName, roomServiceSocket }) => {
    const history = useHistory()
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
        joinRoom(username, formDisplayName);
        history.push(`/room/${username}`)
    }

    const displayNameInvalid = formDisplayName.length == 0
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
                <Button type='submit' disabled={displayNameInvalid}>
                    Continue
                </Button>
            </form>
        </ResponsiveContainer>
    )
}

const mapStateToProps = (state) => {
  return {
    roomServiceSocket: roomServiceSocketSelector(state)
  }
};

const mapDispatchToProps = {
  createRoomServiceConnection,
  setDisplayName,
}

export default connect(mapStateToProps, mapDispatchToProps)(DisplayNamePage)
