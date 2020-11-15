import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Button, Checkbox, FormControlLabel } from '@material-ui/core'
import firebase from 'firebase/app'
import 'firebase/auth'
import EditCard from './EditCard'
import AddCard from './AddCard'
import EditCardGrid from '../../components/EditCardGrid'
import { roomServiceSocketSelector } from '../../data/state/room-service/room-service.selectors';
import {
  createRoomServiceConnection,
  emitEvent,
} from '../../data/state/room-service/room-service.actions';
import { setAccount } from '../../data/state/account/account.actions';
import { accountSelector } from '../../data/state/account/account.selector';
import { SET_ACCOUNT } from '../../data/state/action-types'

const EditArea = ({ onSave, emitEvent, onSubmit, roomServiceSocket, createRoomServiceConnection }) => {
  const [loading, setLoading] = useState(false)
  const [cards, setCards] = useState([
    {
      value: 1,
      tag: 'ezz',
    },
    {
      value: 2,
      tag: 'ez',
    },
    {
      value: 3,
      tag: 'hard',
    },
  ])
  const [allowAbstain, setAllowAbstain] = useState(false);
  const [roomExistsError, setRoomExistsError ] = useState(false);
  const history = useHistory()

  useEffect(() => {
    (async () => {
      setAccount({ username: 'falc' });
      const socket = await createRoomServiceConnection()
      socket.on('connect', () => {
        console.log('Connected!');
      });
      socket.on('disconnect', () => {
          console.log('Disconnected');
          // dispatch({ type: types.SET_DISPLAY_NAME, displayName: '' })
          // dispatch({ type: types.SET_CONNECTED_TO_ROOM, connectedToRoom: false })
      });
      socket.on('room_already_created', event => {
        console.log(event);
      });
      socket.on('create_success', event => {
        console.log('create_success')
        history.push('/room/falc')
      });
    })()
  }, [])

  const genChangeCard = (idx) => {
    return (card) => {
      const cardsCopy = [...cards]
      cardsCopy[idx] = card
      setCards(cardsCopy)
    }
  }

  const genOnDelete = (idx) => {
    return () => {
      const cardsCopy = [...cards.slice(0, idx), ...cards.slice(idx + 1)]
      console.log(cardsCopy)
      setCards(cardsCopy)
    }
  }

  //TODO move this to action or somewhere else
  const onStart = async () => {
    try {
      setLoading(true)

      await firebase
        .auth()
        .signInWithEmailAndPassword('ryglaspey@knights.ucf.edu', 'password')

      const idToken = await firebase.auth().currentUser.getIdToken(true)

      const config = {
        deck: cards,
        allowAbstain,
      }

      console.log('create_room')
      emitEvent('create_room', {
          roomID: 'falc',
          roomConfig: config,
      });
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  let elements = cards.map((it, idx) => (
    <EditCard
      key={idx}
      card={it}
      setCard={genChangeCard(idx)}
      deleteCard={genOnDelete(idx)}
      setAllowAbstain={(flag) => setAllowAbstain(flag)}
    />
  ))
  elements.push(
    <AddCard
      key='add'
      onClick={() => setCards(cards.concat({ value: 1, tag: 'ez' }))}
    />
  )
  return (
    <div>
      <EditCardGrid>{elements}</EditCardGrid>
      <FormControlLabel
        control={
          <Checkbox
            checked={allowAbstain}
            onChange={(event) => setAllowAbstain(event.target.checked)}
          >
            Allow Abstain
          </Checkbox>
        }
        label='Allow Abstain'
      />
      <Button disabled={loading} onClick={() => onSave()}>
        Save
      </Button>
      <Button disabled={loading} variant='contained' onClick={() => onStart()}>
        Start
      </Button>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    account: accountSelector,
    roomServiceSocket: roomServiceSocketSelector(state)
  }
};

const mapDispatchToProps = {
  createRoomServiceConnection,
  emitEvent,
}

export default connect(mapStateToProps, mapDispatchToProps)(EditArea)
