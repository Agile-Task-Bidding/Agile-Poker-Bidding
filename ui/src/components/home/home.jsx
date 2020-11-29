import React, { useState, useEffect } from 'react'
import mainImg from '../icon/logo.svg'
import userImg from '../icon/girl.svg'
import './style.css'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { accountSelector } from '../../data/state/account/account.selector'
import { Typography } from '@material-ui/core'
import { setAccount, loginUser } from '../../data/state/account/account.actions'
import firebase from 'firebase/app'
import 'firebase/auth'
import { withRouter } from 'react-router-dom'

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isUserLoggedIn: true,
      // user: {
      //   username: 'RealRyan',
      //   email: '',
      // },
      roomNumber: '',
    }
  }

  componentDidMount = () => {
    this.props.loginUser(() => {}, this.props.setAccount)
  }

  handleChange = (event) => {
    this.setState({ roomNumber: event.target.value })
  }

  doSignOut = () => {
    firebase.auth().signOut()
  }

  render() {
    // const { user } = this.state
    const { account } = this.props
    const { roomNumber } = this.state
    const { isUserLoggedIn } = this.state

    return (
      <div className='base-container' ref={this.props.containerRef}>
        {!!account && (
          <div style={{ width: '80%' }}>
            <Grid
              container
              direction='row'
              justify='space-between'
              alignItems='center'
            >
              <Grid item>
                <Box
                  display='flex'
                  justifyContent='center'
                  text-align='center'
                  m={0.5}
                >
                  <Box
                    display='flex'
                    justifyContent='center'
                    text-align='center'
                    m={0.5}
                  >
                    <img src={userImg} />
                  </Box>
                  <Box>
                    <h3 className='userCredentials'> {account.username}</h3>
                  </Box>
                </Box>
              </Grid>
              <Grid>
                <Button
                  onClick={this.doSignOut}
                  variant='contained'
                  color='primary'
                  // component={Link}
                  // to={'/'}
                  disableElevation
                >
                  Log Out
                </Button>
              </Grid>
            </Grid>
          </div>
        )}
        {!!!account && (
          <div style={{ width: '80%' }}>
            <Grid
              container
              direction='row'
              justify='flex-end'
              alignItems='center'
            >
              <Grid>
                <Button
                  variant='contained'
                  color='primary'
                  component={Link}
                  to={'/login'}
                  disableElevation
                >
                  Log In
                </Button>
              </Grid>
            </Grid>
          </div>
        )}
        <div className='content'>
          <div className='image'>
            <img src={mainImg} />
          </div>
          <Typography variant='h1' color='primary'>
            PilePlan
          </Typography>
          <div style={{ marginTop: 20 }}>
            <Button
              variant='contained'
              color='primary'
              fullWidth
              style={{
                fontSize: 25,
              }}
              component={Link}
              to={'/create'}
            >
              HOST ROOM
            </Button>

            <div style={{ marginTop: 20 }}>
              <TextField
                onChange={this.handleChange}
                name='roomid'
                label='Room ID'
                variant='filled'
                margin='dense'
                validators={['required']}
                // errorMessages={['Room ID is required']}
                InputProps={{ disableUnderline: true }}
                fullWidth
                style={{ marginBottom: 0 }}
              />

              <Button
                variant='contained'
                color='primary'
                fullWidth
                style={{
                  maxHeight: '50px',
                  minHeight: '50px',
                  fontSize: 25,
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                }}
                component={Link}
                to={'/room/' + this.state.roomNumber}
              >
                JOIN ROOM
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    account: accountSelector(state),
  }
}

const mapDispatchToProps = {
  setAccount,
  loginUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
