import React, { useState } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Button, Checkbox, FormControlLabel } from '@material-ui/core'
import firebase from 'firebase/app'
import 'firebase/auth'
import EditCard from './EditCard'
import AddCard from './AddCard'
import EditCardGrid from './EditCardGrid'
import { roomServiceSocketSelector } from '../../data/state/room-service/room-service.selectors';
import { createRoomServiceConnection } from '../../data/state/room-service/room-service.actions';

const EditArea = ({ onSave, onSubmit, roomServiceSocket, createRoomServiceConnection }) => {
  const [loading, setLoading] = useState(false)
  const [cards, setCards] = useState([
    {
      number: 1,
      hint: 'ezz',
    },
    {
      number: 2,
      hint: 'ez',
    },
    {
      number: 3,
      hint: 'hard',
    },
  ])
  const [allowAbstain, setAllowAbstain] = useState(false)
  const history = useHistory()

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
  const onStart = async (cards, allowAbstain) => {
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

      console.log('api_call', '/SaveConfig', { idToken, config })
      console.log('socket_emit', 'start_game', { idToken, config })

      const socket = await createRoomServiceConnection()
      console.log(socket);
      socket.on('connect', () => {
        console.log('herer');
        socket.on('verified', (data) => {
          console.log('verified', data);
        })
        socket.emit('verify_me', { idToken })
        socket.emit(
          'start_game',
          {
            idToken,
            config,
          }
        )
  
        history.push('/room/afdafsd')
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
      onClick={() => setCards(cards.concat({ number: 1, hint: 'ez' }))}
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
    roomServiceSocket: roomServiceSocketSelector(state)
  }
};

const mapDispatchToProps = {
  createRoomServiceConnection
}

export default connect(mapStateToProps, mapDispatchToProps)(EditArea)
