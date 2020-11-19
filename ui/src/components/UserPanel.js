import React from 'react'
import logo from './icon/logo.svg'

const UserPanel = () => {
  return (
    <aside className={`sidebar show-sidebar`}>
      <div className='sidebar-header'>
        <img src={logo} className='logo' alt='coding addict' />
        <button className='close-btn' onClick={''}></button>
      </div>
      <ul className='links'></ul>
      <ul className='social-icons'></ul>
    </aside>
  )
}

export default UserPanel
