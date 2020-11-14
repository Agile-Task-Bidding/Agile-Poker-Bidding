import React, { useState, useEffect } from 'react'
import mainImg from '../icon/logo.svg'
import userImg from '../icon/girl.svg'
import './style.css'
import { FormGroup } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { Link } from 'react-router-dom'

export class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isUserLoggedIn: false,
      user: {
        username: 'Magda',
        email: '',
      },
      roomNumber: '123abc',
    }
  }

  handleChange = (event) => {
    const { roomNumber } = this.state
    this.setState({ roomNumber })
  }

  render() {
    const { user } = this.state
    const { roomNumber } = this.state
    const { isUserLoggedIn } = this.state
    return (
      <div className='base-container' ref={this.props.containerRef}>
        {isUserLoggedIn && (
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
                    <h3 className='userCredentials'> {user.username}</h3>
                  </Box>
                </Box>
              </Grid>
              <Grid>
                <button type='button' className='btn'>
                  Log Out
                </button>
              </Grid>
            </Grid>
          </div>
        )}
        {!isUserLoggedIn && (
          <div style={{ width: '80%' }}>
            <Grid
              container
              direction='row'
              justify='flex-end'
              alignItems='center'
            >
              <Grid>
                <Button
                  type='button'
                  className='btn'
                  component={Link}
                  to={'/login'}
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
          <div className='buttons'>
            <div>
              <Button
                type='button'
                className='btn'
                component={Link}
                to={'/create'}
              >
                HOST ROOM
              </Button>
            </div>
            <div style={{ marginTop: 10 }}>
              {/* <ValidatorForm
                ref='form'
                onSubmit={this.handleSubmit}
                onError={(errors) => console.log(errors)}
              > */}
              {/* <TextValidator
                  label='Room ID'
                  onChange={this.handleChange}
                  name='roomid'
                  validators={['required']}
                  errorMessages={['Room ID is required']}
                  value={roomNumber}
                  variant='filled'
                  margin='dense'
                  InputProps={{ disableUnderline: true }}
                  fullWidth
                ></TextValidator> */}
              <TextField
                onChange={this.handleChange}
                name='roomid'
                label='Room ID'
                variant='filled'
                margin='dense'
                validators={['required']}
                errorMessages={['Room ID is required']}
                InputProps={{ disableUnderline: true }}
                fullWidth
              />
              {/* <button
                type='button'
                className='btn hostjoin'
                style={{ margin: 0 }}
              >
                JOIN ROOM
              </button> */}
              <Button
                type='button'
                className='btn'
                component={Link}
                to={'/room/' + this.state.roomNumber}
              >
                JOIN ROOM
              </Button>
              {/* </ValidatorForm> */}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
