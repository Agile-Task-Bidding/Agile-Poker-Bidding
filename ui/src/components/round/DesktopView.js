import React from 'react'
import { StyleSheet, css } from 'aphrodite'

const DesktopView = ({ header, primary, secondary }) => {
  return (
    <div className={css(styles.container)}>
      {primary}
      {secondary}
    </div>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
  },
})

export default DesktopView
