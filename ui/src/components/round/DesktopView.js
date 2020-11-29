import React from 'react'
import { StyleSheet, css } from 'aphrodite'

const DesktopView = ({ header, primary, secondary }) => {
  return (
    <div className={css(styles.container)}>
      <div className={css(styles.center)}>
        {primary}
      </div>
      {secondary}
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
  }
})

export default DesktopView
