import React, { useState, useEffect } from 'react'
import mainImg from '../icon/logo.svg'
import userImg from '../icon/girl.svg'
import './style.css'
import { FormGroup } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import TextField from '@material-ui/core/TextField'

export class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isUserLoggedIn: true,
      user: {
        username: 'Magda',
        email: '',
      },
      roomNumber: '',
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
                <button type='button' className='btn'>
                  Log In
                </button>
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
              <button type='button' className='btn hostjoin'>
                HOST ROOM
              </button>
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
              <button
                type='button'
                className='btn hostjoin'
                style={{ margin: 0 }}
              >
                JOIN ROOM
              </button>
              {/* </ValidatorForm> */}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
