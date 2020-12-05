import React from 'react'
import { StyleSheet, css } from 'aphrodite'

const MobileView = ({ children }) => {
  return (
    <div className={css(styles.center)}>
        {children}
    </div>
  )
}

const styles = StyleSheet.create({
  center: {
    display: 'flex',
    justifyContent: 'center',
    padding: 12,
  }
})

export default MobileView
