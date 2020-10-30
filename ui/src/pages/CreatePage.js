import React, { useState } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import {
  Container,
  TextField,
  Paper,
  Button,
  Card,
  CardContent,
  CardActionArea,
  CardActions,
} from '@material-ui/core'
import firebase from 'firebase/app'
import 'firebase/auth'
import { globalSocketSelector } from '../data/state/global-socket/global-socket.selectors'
import { createGlobalSocket } from '../data/state/global-socket/global-socket.actions'

const CreateBiddingCard = ({ onCreate }) => {
  return (
    <Card
      elevation={1}
      style={{
        padding: 12,
        margin: 12,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        height: '30vh',
        width: '20vh',
      }}
    >
      <CardContent style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button onClick={() => onCreate()}>+</Button>
      </CardContent>
    </Card>
  )
}

const EditBiddingCard = ({
  number,
  description,
  changeNumber,
  changeDescription,
  doDelete, // rename onDelete
}) => {
  return (
    <Card
      elevation={1}
      style={{
        padding: 12,
        margin: 12,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        height: '30vh',
        width: '20vh',
      }}
    >
      <CardContent>
        <TextField
          value={number}
          onChange={(event) => changeNumber(event.target.value)}
        />
        <TextField
          value={description}
          onChange={(event) => changeDescription(event.target.value)}
        />
      </CardContent>
      <CardActions>
        <Button onClick={() => doDelete()}>Delete</Button>
      </CardActions>
    </Card>
  )
}

const EditZoneRaw = ({ createGlobalSocket }) => {
  const history = useHistory()
  const [launched, setLaunched] = useState(false)
  const [cards, setCards] = useState([
    { number: 1, description: 'straightforward' },
    { number: 2, description: 'simple' },
    { number: 3, description: 'reasonable' },
    { number: 5, description: 'complex' },
    { number: 8, description: 'too complex' },
  ])

  const genChangeNumber = (idx) => {
    return (number) => {
      const cardsCopy = [...cards]
      cardsCopy[idx].number = number
      setCards(cardsCopy)
    }
  }

  const genChangeDescription = (idx) => {
    return (description) => {
      const cardsCopy = [...cards]
      cardsCopy[idx].description = description
      setCards(cardsCopy)
    }
  }

  const genDoDelete = (idx) => {
    return () => {
      let cardsCopy = [...cards]
      cardsCopy = [...cardsCopy.slice(0, idx), ...cardsCopy.slice(idx + 1)]
      console.log(cardsCopy)
      setCards(cardsCopy)
    }
  }

  let elements = cards.map((card, idx) => (
    <EditBiddingCard
      key={idx}
      number={card.number}
      description={card.description}
      changeNumber={genChangeNumber(idx)}
      changeDescription={genChangeDescription(idx)}
      doDelete={genDoDelete(idx)}
    />
  ))
  elements.push(
    <CreateBiddingCard
      key='create'
      onCreate={() =>
        setCards(cards.concat({ number: -1, description: 'complex' }))
      }
    />
  )

  const startGame = async () => {
    try {
      setLaunched(true)

      await firebase
        .auth()
        .signInWithEmailAndPassword('ryglaspey@knights.ucf.edu', 'password')

      const idToken = await firebase.auth().currentUser.getIdToken(true)

      const config = {
        allowAbstain: true,
        deck: cards,
      }

      console.log('api_call', '/SaveConfig', { idToken, config })
      console.log('socket_emit', 'start_game', { idToken, config })

      const socket = await createGlobalSocket()
      socket.emit('client_info', 'yes')
      socket.emit(
        'start_game',
        JSON.stringify({
          idToken,
          config,
        })
      )

      history.push('/room/afdafsd')
    } catch (err) {
      console.error(err)
      setLaunched(false)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
      }}
    >
      {elements}
      <Button fullWidth variant='contained'>
        Save
      </Button>
      <Button
        fullWidth
        variant='contained'
        disabled={launched}
        onClick={startGame}
      >
        Start
      </Button>
    </div>
  )
}
const mapStateToPropsEdit = (state) => {
  return {}
}
const mapDispatchToPropsEdit = {
  createGlobalSocket,
}
const EditZone = connect(
  mapStateToPropsEdit,
  mapDispatchToPropsEdit
)(EditZoneRaw)

const CreatePage = ({ createGlobalSocket }) => {
  return (
    <div style={{ width: '100vw', minHeight: '100vh' }}>
      <Container style={{ padding: 24, backgroundColor: '#1e5ca6' }}>
        <EditZone />
      </Container>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    globalSocket: globalSocketSelector(state),
  }
}

const mapDispatchToProps = {
  createGlobalSocket,
}

export default connect(mapStateToProps, mapDispatchToProps)(CreatePage)
