import React, { useState } from 'react'
import logo from '../components/icon/logo.svg'
import './Login.css'
import { Login, Register } from '../components/login/index'
import { AppProvider } from '../components/login/context'
import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
// import { Modal } from '../components/login/modal'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'

import { createMuiTheme } from '@material-ui/core/styles'
import { FormGroup, Typography } from '@material-ui/core'

const font = "'Reem Kufi', sans-serif"

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#7FBAF7',
      main: '#2b84ed',
      dark: '#223496',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#fff',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
  typography: {
    fontFamily: font,
  },
})
class LoginRegisterPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLogginActive: true,
      isModalOn: false,
      user: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
    }
  }

  componentDidMount() {
    //Add .right by default
    this.rightSide.classList.add('right')
  }

  handleChange = (event) => {
    const { user } = this.state
    user[event.target.name] = event.target.value
    this.setState({ user })
  }

  changeState() {
    const { isLogginActive } = this.state

    if (isLogginActive) {
      this.rightSide.classList.remove('right')
      this.rightSide.classList.add('left')
    } else {
      this.rightSide.classList.remove('left')
      this.rightSide.classList.add('right')
    }
    this.setState((prevState) => ({
      isLogginActive: !prevState.isLogginActive,
    }))
  }

  render() {
    const { isLogginActive } = this.state
    const { email } = this.state
    const { isModalOn } = this.state
    const { user } = this.state
    const current = isLogginActive ? 'Register' : 'Login'
    const currentActive = isLogginActive ? 'login' : 'register'

    const handleClickOpen = () => {
      this.setState({ isModalOn: true })
    }

    const handleClose = () => {
      this.setState({ isModalOn: false })
    }

    return (
      <MuiThemeProvider theme={theme}>
        <div className='App'>
          <div className='radiant-background'>
            <div className='login'>
              <Dialog
                open={this.state.isModalOn}
                aria-labelledby='form-dialog-title'
              >
                <DialogTitle id='form-dialog-title'>
                  Forgot Password?
                </DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Enter your email below to reset your password
                  </DialogContentText>

                  <ValidatorForm
                    ref='form'
                    onSubmit={this.handleSubmit}
                    onError={(errors) => console.log(errors)}
                  >
                    <div ClassName='form-group'>
                      <TextValidator
                        label='E-mail'
                        onChange={this.handleChange}
                        name='email'
                        value={user.email}
                        validators={['required', 'isEmail']}
                        errorMessages={['Required Field', 'Email is invalid']}
                        variant='filled'
                        margin='dense'
                        InputProps={{ disableUnderline: true }}
                        fullWidth
                      />
                    </div>
                  </ValidatorForm>
                </DialogContent>
                <DialogActions>
                  <Button
                    variant='contained'
                    color='primary'
                    fullWidth
                    style={{
                      margin: '15px',
                    }}
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant='contained'
                    color='primary'
                    fullWidth
                    style={{
                      margin: '15px',
                    }}
                    onClick={handleClose}
                  >
                    Reset
                  </Button>
                </DialogActions>
              </Dialog>

              <div className='container' ref={(ref) => (this.container = ref)}>
                {isLogginActive && (
                  <Login
                    containerRef={(ref) => (this.current = ref)}
                    onForgotPassword={handleClickOpen}
                  />
                )}
                {!isLogginActive && (
                  <Register containerRef={(ref) => (this.current = ref)} />
                )}
              </div>
              <RightSide
                current={current}
                currentActive={currentActive}
                containerRef={(ref) => (this.rightSide = ref)}
                onClick={this.changeState.bind(this)}
              />
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

const RightSide = (props) => {
  return (
    <div
      className='right-side'
      ref={props.containerRef}
      onClick={props.onClick}
    >
      <div className='inner-container' className='text'>
        <Typography variant='h5' color='secondary'>
          {props.current}
        </Typography>
      </div>
    </div>
  )
}

export default LoginRegisterPage
