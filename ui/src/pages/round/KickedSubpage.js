import React from 'react'
import { connect } from 'react-redux'
import { Typography } from '@material-ui/core'
import { TextField, Button, CircularProgress } from '@material-ui/core'
import mainImg from '../../components/icon/logo.svg'
import AppState from '../../services/AppState'
import RickRolled from '../../components/round/RickRolled'
import { setAppState } from '../../data/state/app-data/app-data.actions'
import { Link, useHistory } from 'react-router-dom'

const KickedSubpage = ({ setAppState }) => {

  const history = useHistory();

  return (
    <div className='App '>
      <RickRolled />
      <div className='radiant-background'>
        <div className='login'>
          <div className='container'>
            <div className='base-container'>
              <div className='content'>
                <div className='image' style={{ marginTop: 30 }}>
                  <img src={mainImg} />
                </div>
                <Typography
                  variant='h1'
                  color='primary'
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  PilePlan
                </Typography>

                <div
                  style={{
                    marginTop: 40,
                    display: 'block',
                    justifyContent: 'center',
                  }}
                >
                  <div>
                    <Typography variant='h5' color='primary'>
                      You have been kicked
                    </Typography>
                  </div>
                  <div>
                    <Button
                      variant='contained'
                      color='primary'
                      fullWidth
                      style={{
                        fontSize: 15,
                        marginTop: 15,
                      }}
                      onClick={() => {
                        history.push('/')
                        setAppState(AppState.PICK_DISPLAY_NAME)
                      }}
                    >
                      Home Page
                    </Button>
                  </div>
                  <div>
                    <Button
                      variant='contained'
                      color='primary'
                      fullWidth
                      style={{
                        fontSize: 15,
                        marginTop: 15,
                      }}
                      onClick={() => {
                        setAppState(AppState.PICK_DISPLAY_NAME)
                      }}
                    >
                      Rejoin Room
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = {
  setAppState,
}

export default connect(mapStateToProps, mapDispatchToProps)(KickedSubpage)
