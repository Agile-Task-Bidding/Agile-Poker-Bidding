import React from 'react'
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core'
import { TextField, Button, CircularProgress } from '@material-ui/core'
import mainImg from '../../components/icon/logo.svg'
import { Link, useHistory } from 'react-router-dom'
import { setAppState } from '../../data/state/app-data/app-data.actions'
import AppState from '../../services/AppState'

const InactiveSubpage = ({ setAppState }) => {

  const history = useHistory();

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

                <div style={{ marginTop: 30 }}>
                  <Typography variant='h6' color='primary'>
                    This room isn't open
                  </Typography>

                  <Button
                    variant='contained'
                    color='primary'
                    fullWidth
                    style={{
                      fontSize: 15,
                    }}
                    onClick={() => {
                      setAppState(AppState.PICK_DISPLAY_NAME);
                      history.push('/');
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

const mapStateToProps = state => { return {} };
const mapDispatchToProps = {
  setAppState,
};

export default connect(mapStateToProps, mapDispatchToProps)(InactiveSubpage);
