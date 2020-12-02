import React from 'react'
import loginImg from '../icon/logo.svg'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import { FormGroup, Typography } from '@material-ui/core'
import firebase from 'firebase/app'
import 'firebase/auth'
import { withRouter } from 'react-router-dom'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import axios from 'axios'
import { StyleSheet, css } from 'aphrodite'

var actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: 'http://localhost:3000/verifyemail',
  // This must be true.
  handleCodeInApp: true,
  // iOS: {
  //   bundleId: 'com.example.ios',
  // },
  // android: {
  //   packageName: 'com.example.android',
  //   installApp: true,
  //   minimumVersion: '12',
  // // },
  // dynamicLinkDomain: 'example.page.link',
}
const styles = StyleSheet.create({
  deleteclass: {
    margin: '-1px',
  },
})

export class Register extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
    }
  }

  handleChange = (event) => {
    const { user } = this.state
    user[event.target.name] = event.target.value
    this.setState({ user })
  }

  handleSubmit = () => {
    // firebase
    //   .auth()
    //   .createUserWithEmailAndPassword(
    //     this.state.user.email,
    //     this.state.user.password
    //   )
    //   .then((user) => {
    //     console.log('in the base')
    //     // Signed in
    //     // ...
    //   })
    //   .catch((error) => {
    //     var errorCode = error.code
    //     console.log('fucked up... again')
    //     var errorMessage = error.message
    //     // ..
    //   })
    axios.post(`/api/v1/users`, {
      username: this.state.user.username,
      email: this.state.user.email,
      password: this.state.user.password,
    })
    firebase
      .auth()
      .sendSignInLinkToEmail(this.state.user.email, actionCodeSettings)
      .then(function () {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem('emailForSignIn', this.state.user.email)
      })
      .catch(function (error) {
        // Some error occurred, you can inspect the code: error.code
      })
  }

  componentDidMount() {
    // custom rule will have name 'isPasswordMatch'
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
      if (value !== this.state.user.password) {
        return false
      }
      return true
    })
  }

  componentWillUnmount() {
    // remove rule when it is not needed
    ValidatorForm.removeValidationRule('isPasswordMatch')
  }

  render() {
    // const { username } = this.state
    // const { email } = this.state
    const { user } = this.state

    return (
      <div className='base-container' ref={this.props.containerRef}>
        {/* <div className="header">REGISTER</div> */}
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
              ref='form'
              onSubmit={this.handleSubmit}
              onError={(errors) => console.log(errors)}
            >
              <TextValidator
                className={css(styles.deleteclass)}
                label='Username'
                onChange={this.handleChange}
                name='username'
                value={user.username}
                validators={[
                  'required',
                  'minStringLength: 1',
                  'maxStringLength: 15',
                ]}
                errorMessages={[
                  'Username is required',
                  'Username must be at least have 1 character',
                  'Username can have maximum 15 characters',
                ]}
                variant='filled'
                InputProps={{ disableUnderline: true }}
                fullWidth
                helperText=' '
                variant='filled'
                margin='dense'
              />

              {/* <input type='text' name='username' placeholder='Username' /> */}

              <TextValidator
                className={css(styles.deleteclass)}
                label='E-mail'
                onChange={this.handleChange}
                name='email'
                value={user.email}
                validators={['required', 'isEmail']}
                errorMessages={['Required Field', 'Email is invalid']}
                variant='filled'
                margin='dense'
                helperText=' '
                InputProps={{ disableUnderline: true }}
                fullWidth
              />
              {/* <input type='text' name='email' placeholder='E-mail' /> */}

              <TextValidator
                className={css(styles.deleteclass)}
                label='Password'
                onChange={this.handleChange}
                name='password'
                type='password'
                validators={['required', 'minStringLength: 6']}
                errorMessages={[
                  'Password is required',
                  'Password must be at least 6 characters long',
                ]}
                value={user.password}
                variant='filled'
                margin='dense'
                helperText=' '
                InputProps={{ disableUnderline: true }}
                fullWidth
              />
              {/* <input type='text' name='password' placeholder='Password' /> */}

              {/* <TextValidator
                className={css(styles.deleteclass)}
                label='Confirm Password'
                onChange={this.handleChange}
                name='confirmPassword'
                type='password'
                validators={['isPasswordMatch', 'required']}
                errorMessages={['Passwords Mismatch', 'Required Field']}
                value={user.confirmPassword}
                variant='filled'
                margin='dense'
                InputProps={{ disableUnderline: true }}
                fullWidth
              /> */}
              {/* <input
                  type='text'
                  name='confirmPassword'
                  placeholder='Confirm Password'
                /> */}
              <Button
                variant='contained'
                color='primary'
                type='submit'
                fullWidth
                // component={Link}
                // to={'/home'}
                onClick={this.doRegister}
              >
                Sign Up
              </Button>
            </ValidatorForm>
          </div>
        </div>
      </div>
    )
  }
}
