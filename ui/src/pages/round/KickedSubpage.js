import React from 'react'
import { Typography } from '@material-ui/core'
import { TextField, Button, CircularProgress } from '@material-ui/core'
import mainImg from '../../components/icon/logo.svg'
import { Link } from 'react-router-dom'

const KickedSubpage = (props) => {
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
                    You have been kicked
                  </Typography>

                  <Button
                    variant='contained'
                    color='primary'
                    fullWidth
                    style={{
                      fontSize: 15,
                    }}
                    type='submit'
                    component={Link}
                    to={'/'}
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

export default KickedSubpage
