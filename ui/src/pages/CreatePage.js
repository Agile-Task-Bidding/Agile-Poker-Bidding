import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from '@material-ui/core'
import { useSnackbar } from 'notistack'
import CoffeeCard from '../components/create/CoffeeCard'
import EditCard from '../components/create/EditCard'
import AddCard from '../components/create/AddCard'
import CardGrid from '../components/CardGrid'
import { roomServiceSocketSelector } from '../data/state/room-service/room-service.selectors'
import {
  createRoomServiceConnection,
  emitEvent,
} from '../data/state/room-service/room-service.actions'
import { loginUser } from '../data/state/account/account.actions'
import {
  startGame,
  saveGame,
} from '../data/state/room-config/room-config.actions'
import { setAccount } from '../data/state/account/account.actions'
import { accountSelector } from '../data/state/account/account.selector'
import axios from 'axios'
import './Styling.css'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import ResponsiveContainer from '../components/ResponsiveContainer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import { Link } from 'react-router-dom'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import Box from '@material-ui/core/Box'
import Slide from '@material-ui/core/Slide'
import PropTypes from 'prop-types'
import userImg from '../components/icon/logowhite.svg'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import * as RoomService from '../services/RoomService'
import firebase from 'firebase'
import 'firebase/auth'

function ElevationScroll(props) {
  const { children, window } = props
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  })

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  })
}

ElevationScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
}

const CreatePage = ({
  account,
  loginUser,
  emitEvent,
  startGame,
  saveGame,
  onSubmit,
  roomServiceSocket,
  createRoomServiceConnection,
}) => {
  const [loading, setLoading] = useState(false)
  const [cards, setCards] = useState([])
  const [allowAbstain, setAllowAbstain] = useState(false)
  const [roomExistsError, setRoomExistsError] = useState(false)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const history = useHistory()

  let onConnect
  let onDisconnect
  let onRoomAlreadyCreated
  let onNotAuthorized
  let onCreateSuccess
  let onRoomStatusFetched

  const registerSocketEvents = (socket, account) => {
    onConnect = RoomService.onConnect(socket, () => {
      console.log('Connected!')
    })
    onDisconnect = RoomService.onDisconnect(socket, () => {
      console.log('Disconnected')
    })
    onRoomAlreadyCreated = RoomService.onRoomAlreadyCreated(socket, console.log)
    onNotAuthorized = RoomService.onNotAuthorized(socket, console.log)
    onCreateSuccess = RoomService.onCreateSuccess(socket, () => {
      history.push(`/room/${account.username}`)
    })
    onRoomStatusFetched = RoomService.onRoomStatusFetched(socket, (status) => {
      if (status === 'ACTIVE') {
        history.push(`/room/${account.username}`)
      }
    })
  }

  const unregisterSocketEvents = (socket) => {
    onConnect.off()
    onDisconnect.off()
    onRoomAlreadyCreated.off()
    onNotAuthorized.off()
    onCreateSuccess.off()
    onRoomStatusFetched.off()
  }

  const unformatDeck = (deck) => {
    return deck.map(card => { return { value: `${card.value}`, tag: card.tag }});
  }

  const formatDeck = (deck) => {
    return deck.map(card => { return { value: Number(card.value), tag: card.tag }; })
  }

  useEffect(() => {
    ;(async () => {
      loginUser(async (account) => {
        if (account) {
          setCards(unformatDeck(account.roomConfig.deck))
          setAllowAbstain(account.roomConfig.allowAbstain)
          const socket = await createRoomServiceConnection()

          RoomService.emitIsRoomOpen(socket, account.username)

          registerSocketEvents(socket, account)

          const notVerified = firebase.auth().currentUser && !firebase.auth().currentUser.emailVerified;
          if (notVerified) {
            enqueueSnackbar(`Don't forget to verify your account`, { variant: 'warning' })
          }

          return () => { unregisterSocketEvents(socket); }
        } else {
          history.push('/login')
        }
      }, setAccount)
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

  const onSave = async () => {
    setLoading(true)

    const roomConfig = {
      deck: formatDeck(cards),
      allowAbstain,
    }

    await saveGame(roomConfig)

    enqueueSnackbar(`Saved`, { variant: 'success' })

    setLoading(false)
  }

  const onStart = async () => {
    try {
      setLoading(true)

      const roomConfig = {
        deck: formatDeck(cards),
        allowAbstain,
      }

      await startGame(account.username, roomConfig)
    } catch (err) {
      console.error(err)
    }
  }
  const frequencyMap = new Map()
  cards.forEach(card => {
    if (frequencyMap.has(card.value)) {
      frequencyMap.set(card.value, frequencyMap.get(card.value)+1);
    } else {
      frequencyMap.set(card.value, 1);
    }
  })

  const deckErrors = cards.map(card => {
    if (!card.value) return 'error/falsy'
    if (isNaN(card.value)) return 'error/nan'
    if (frequencyMap.get(card.value) > 1) return 'error/duplicate'
    return '';
  })
  const isError = !!deckErrors.find(it => !!it);

  const elements = []
  elements.push(...cards.map((it, idx) => (
    <EditCard
      key={idx}
      card={it}
      valueError={deckErrors[idx]}
      setCard={genChangeCard(idx)}
      deleteCard={genOnDelete(idx)}
      setAllowAbstain={(flag) => setAllowAbstain(flag)}
    />
  )))
  elements.push(
    <AddCard
      key='add'
      onClick={() => setCards(cards.concat({ value: '1', tag: 'ez' }))}
    />
  )
  if (allowAbstain) {
    elements.push(<CoffeeCard key='abstain' />)
  }
  const classes = useStyles()

  return (
    <ResponsiveContainer>
      <ElevationScroll fullWidth>
        <AppBar
          position='fixed'
          style={{
            zIndex: '1500',
          }}
        >
          <Toolbar
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
            // noWrap
          >
            <Button
              component={Link}
              to={'/'}
              // fontSize='small'

              style={{
                //   paddingTop: '16px',
                //   paddingBottom: '8px',
                color: '#fff',
                //   font: "'Reem Kufi', sans-serif",
              }}
            >
              <img src={userImg} style={{ height: '30px' }} />
              <Typography
                variant='h6'
                style={{
                  paddingTop: '16px',
                  paddingBottom: '8px',
                  textIndent: '0.5em',
                  textTransform: 'none',
                }}
              >
                PilePlan
              </Typography>
            </Button>

            <div>
              <Typography variant='h6'>CONFIGURE DECK</Typography>
            </div>
            <Button
              disabled={loading || isError}
              variant='outlined'
              color='secondary'
              style={{
                margin: '5px',
                paddingTop: '5px',
                paddingBottom: '5px',
                paddingLeft: '12px',
                paddingRight: '12px',
              }}
              size='large'
              onClick={onStart}
              disableElevation
              startIcon={<PlayArrowIcon />}
            >
              Start
            </Button>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <Toolbar />
      <div className={classes.center}>
        <div>
          <CardGrid className={classes.marginBottom}>{elements}</CardGrid>
          <Grid item component='form' className={classes.root}>
            <div className={classes.abstainsave}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allowAbstain}
                    onChange={(event) => setAllowAbstain(event.target.checked)}
                    color='primary'
                    style={{
                      color: '#2b84ed',
                      marginLeft: 5,
                    }}
                  >
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
                disabled={loading || isError}
                onClick={onSave}
              >
                Save
              </Button>
            </div>
          </Grid>
        </div>
      </div>
    </ResponsiveContainer>
  )
}
const useStyles = makeStyles((theme) => ({
  root: {
    // marginTop: 12,
    padding: '6px 10px',
    // display: 'flex',
    alignItems: 'center',
    //width: 320,
    //background: '#fff',
    display: 'flex',
    justifyContent: 'center',
  },
  abstainsave: {
    width: '240px',
    padding: '6px 10px',
    backgroundColor: '#fff',
    justifyContent: 'center',
    justifySelf: 'center',
    borderRadius: '0.5em',
  },
  title: {
    paddingBottom: 24,
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
  },
  marginBottom: {
    marginBottom: 12,
  },
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
  startGame,
  saveGame,
  loginUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(CreatePage)
