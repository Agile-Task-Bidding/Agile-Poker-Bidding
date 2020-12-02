import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Typography } from '@material-ui/core'
import { TextField, Button, CircularProgress } from '@material-ui/core'
import mainImg from '../components/icon/logo.svg'
import { Link, useHistory } from 'react-router-dom'
import { setAppState } from '../data/state/app-data/app-data.actions'
import AppState from '../services/AppState'
import firebase from 'firebase'
import 'firebase/auth'

const VerifyLinkPage = ({ setAppState }) => {
  const history = useHistory()

  useEffect(() => {
    // Additional state parameters can also be passed via URL.
    // This can be used to continue the user's intended action before triggering
    // the sign-in operation.
    // Get the email if available. This should be available if the user completes
    // the flow on the same device where they started it.
    var email = window.localStorage.getItem('emailForSignIn')
    if (!email) {
      // User opened the link on a different device. To prevent session fixation
      // attacks, ask the user to provide the associated email again. For example:
      email = window.prompt('Please provide your email for confirmation')
    }
    // The client SDK will parse the code from the link for you.
    firebase
      .auth()
      .signInWithEmailLink(email, window.location.href)
      .then(function (result) {
        // Clear email from storage.
        window.localStorage.removeItem('emailForSignIn')
        console.log('success')
        // You can access the new user via result.user
        // Additional user info profile not available via:
        // result.additionalUserInfo.profile == null
        // You can check if the user is new or existing:
        // result.additionalUserInfo.isNewUser
      })
      .catch(function (error) {
        // Some error occurred, you can inspect the code: error.code
        // Common errors could be invalid email and invalid or expired OTPs.
        //TODO expand error handling
        console.log(error)
      })
  }, [])

  return (
    <div className='App '>
      <div className='radiant-background'>
        <div className='login'>
          <div className='container'>
            <div className='base-container'>
              <div className='content'>
                <div className='image' style={{ marginTop: 30 }}>
                  <img src={mainImg} />
                </div>
                <Typography variant='h1' color='primary'>
                  PilePlan
                </Typography>

                <div style={{ marginTop: 120 }}>
                  <Typography variant='h6' color='primary'>
                    Email verified
                  </Typography>

                  <Button
                    variant='contained'
                    color='primary'
                    fullWidth
                    style={{
                      fontSize: 15,
                    }}
                    onClick={() => {
                      setAppState(AppState.PICK_DISPLAY_NAME)
                      history.push('/')
                    }}
                  >
                    Home Page
                  </Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(VerifyLinkPage)
