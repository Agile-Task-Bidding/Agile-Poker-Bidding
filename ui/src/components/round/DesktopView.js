import React from 'react'
import { StyleSheet, css } from 'aphrodite'

const DesktopView = ({ children }) => {
  return (
    <div className={css(styles.container)}>
      <div className={css(styles.center)}>
        {children}
      </div>
    </div>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 240px',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    padding: 12,
  }
})

export default DesktopView
