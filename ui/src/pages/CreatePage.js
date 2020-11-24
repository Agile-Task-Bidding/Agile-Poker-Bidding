import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Button, Checkbox, FormControlLabel, Typography } from '@material-ui/core'
import firebase from 'firebase/app'
import 'firebase/auth'
import EditCard from '../components/create/EditCard'
import AddCard from '../components/create/AddCard'
import EditCardGrid from '../components/EditCardGrid'
import { roomServiceSocketSelector } from '../data/state/room-service/room-service.selectors'
import {
  createRoomServiceConnection,
  emitEvent,
} from '../data/state/room-service/room-service.actions'
import { setAccount } from '../data/state/account/account.actions'
import { accountSelector } from '../data/state/account/account.selector'
import axios from 'axios';
import './Styling.css'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import { loginUser } from '../services/login'
import ResponsiveContainer from '../components/ResponsiveContainer'

const EditArea = ({
  account,
  onSave,
  emitEvent,
  onSubmit,
  roomServiceSocket,
  createRoomServiceConnection,
}) => {
  const [loading, setLoading] = useState(false)
  const [cards, setCards] = useState([])
  const [allowAbstain, setAllowAbstain] = useState(false)
  const [roomExistsError, setRoomExistsError] = useState(false)
  const history = useHistory()

  useEffect(() => {
     (async () => {
      // await firebase
      //   .auth()
      //   .signInWithEmailAndPassword('ryglaspey@knights.ucf.edu', 'password');
      // await firebase.auth().signOut();

        loginUser(async (account) => {
          console.log(account);
          if (account) {
            setCards(account.roomConfig.deck);
            const socket = await createRoomServiceConnection()
            socket.on('connect', () => {
              console.log('Connected!')
            })
            socket.on('disconnect', () => {
              console.log('Disconnected');
            })
            socket.on('room_already_created', (event) => {
              console.log(event)
            })
            socket.on('create_success', (event) => {
              console.log('create_success')
              history.push(`/room/${account.username}`)
            })
          } else {
            history.push('/login');
          }
        }, setAccount);
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
      setCards(cardsCopy)
    }
  }

  //TODO move this to action or somewhere else
  const onStart = async () => {
    try {
      setLoading(true)

      const roomConfig = {
        deck: cards,
        allowAbstain,
      }

      const idToken = await firebase.auth().currentUser.getIdToken(false);
      //TODO remove await
      await axios.put(`http://localhost:80/api/v1/users/${firebase.auth().currentUser.uid}/roomConfig`, { roomConfig }, {
        headers: {
          'Authorization': 'Bearer ' + idToken
        }
      });

      emitEvent('create_room', {
        roomID: account.username,
        roomConfig,
      })
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
  const classes = useStyles()
  return (
    <ResponsiveContainer>
      <Typography variant='h2' className={classes.title}>Configure your deck</Typography>
      <EditCardGrid>{elements}</EditCardGrid>
      <Paper component='form' className={classes.root}>
        <FormControlLabel
          control={
            <Checkbox
              checked={allowAbstain}
              onChange={(event) => setAllowAbstain(event.target.checked)}
              color='primary'
              style={{
                color: '#2b84ed',
              }}
            >
              Allow Abstain
            </Checkbox>
          }
          label='Allow Abstain'
          style={{
            color: '#2b84ed',
            marginLeft: 5,
          }}
        />
        <Button
          variant='contained'
          color='primary'
          style={{
            margin: '5px',
          }}
          disabled={loading}
          onClick={() => onSave()}
        >
          Save
        </Button>
        <Button
          disabled={loading}
          variant='contained'
          color='primary'
          style={{
            margin: '5px',
          }}
          onClick={() => onStart()}
        >
          Start
        </Button>
      </Paper>
    </ResponsiveContainer>
  )
}
const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 12,
    padding: '6px 10px',
    display: 'flex',
    alignItems: 'center',
    width: 320,
    background: '#fff',
  },
  title: {
    paddingBottom: 24,
  }
}))

const mapStateToProps = (state) => {
  return {
    account: accountSelector(state),
    roomServiceSocket: roomServiceSocketSelector(state),
  }
}

const mapDispatchToProps = {
  createRoomServiceConnection,
  emitEvent,
}

export default connect(mapStateToProps, mapDispatchToProps)(EditArea)
