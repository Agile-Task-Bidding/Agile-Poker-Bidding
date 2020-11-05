import React, { useState, useEffect } from 'react'
import mainImg from '../icon/logo.svg'
import './style.css'

export class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className='base-container' ref={this.props.containerRef}>
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
            <div>
              <button type='button' className='btn hostjoin'>
                JOIN ROOM
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
