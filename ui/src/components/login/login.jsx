import React, { useState, useEffect } from 'react'
import loginImg from '../icon/logo.svg'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import { Typography } from '@material-ui/core'
import firebase from 'firebase/app'
import 'firebase/auth'
import { withRouter } from 'react-router-dom'
import { StyleSheet, css } from 'aphrodite'

const styles = StyleSheet.create({
  deleteclass: {
    margin: '-1px',
  },
})
class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isModalOn: false,
      user: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      passwordWrong: false,
    }
  }

  handleChange = (event) => {
    const { user } = this.state
    user[event.target.name] = event.target.value
    this.setState({ user })
  }
  handleSubmit = () => {
    // your submit logic
  }

  doLogin = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(
        this.state.user.email,
        this.state.user.password
      )
      .then((user) => {
        // Signed in
        // ...
        this.props.history.push('/home')
        console.log('we did it')
      })
      .catch((error) => {
        console.log(error)
        if (
          error.code === 'auth/user-not-found' ||
          error.code === 'auth/wrong-password'
        ) {
          this.setState({ passwordWrong: true })
        }
      })
  }

  render() {
    const { user } = this.state
    return (
      <div className='base-container' ref={this.props.containerRef}>
        <div className='content'>
          <div className='image'>
            <img src={loginImg} />
          </div>
          <div>
            <Typography variant='h1' color='primary'>
              PilePlan
            </Typography>
          </div>
          <div className='form'>
            <ValidatorForm
              className={css(styles.deleteclass)}
              ref='form'
              helperText=' '
              onSubmit={this.handleSubmit}
              onError={(errors) => console.log(errors)}
            >
              <div
                ClassName='form-group'
                style={{
                  borderBottomLeftRadius: 5,
                  borderBottomRightRadius: 5000,
                }}
              >
                <TextValidator
                  className={css(styles.deleteclass)}
                  label='E-mail'
                  onChange={this.handleChange}
                  name='email'
                  value={user.email}
                  validators={['required', 'isEmail']}
                  errorMessages={['Required Field', 'Email is invalid']}
                  variant='filled'
                  helperText=' '
                  margin='dense'
                  InputProps={{ disableUnderline: true }}
                  fullWidth
                />
                {/* <input type='text' name='email' placeholder='E-mail' /> */}
              </div>
              <div ClassName='form-group'>
                <TextValidator
                  label='Password'
                  onChange={this.handleChange}
                  name='password'
                  type='password'
                  validators={['required']}
                  errorMessages={['Password is required']}
                  value={user.password}
                  variant='filled'
                  margin='dense'
                  InputProps={{ disableUnderline: true }}
                  fullWidth
                />
                {/* <input type='text' name='password' placeholder='Password' /> */}
              </div>
              <div style={{ marginTop: 4 }}>
                <Typography variant='body1' color='error'>
                  {this.state.passwordWrong ? 'Account does not exist' : ' '}
                </Typography>
              </div>
            </ValidatorForm>
          </div>
        </div>
        <div className='footer'>
          <div>
            <Button
              variant='contained'
              color='primary'
              fullWidth
              style={{
                marginTop: '15px',
                marginBottom: '15px',
              }}
              // style={{
              //   maxHeight: '60px',
              //   minHeight: '60px',
              //   fontSize: 28,
              // }}
              // component={Link}
              // to={''}
              onClick={this.doLogin}
            >
              Log In
            </Button>
          </div>
          <div>
            <Button
              onClick={this.props.onForgotPassword}
              variant='text'
              color='primary'
              fullWidth
            >
              Forgot Password?
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Login)
