import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import { Paper } from '@material-ui/core'

const CardFrame = ({ children, className, ...thruProps }) => {
  return (
    <Paper
      className={css(styles.card) + (className ? ' ' + className : '')}
      elevation={1}
      {...thruProps}
    >
      {children}
    </Paper>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: '1em',
    background: '#fff',
    border: '0.3em solid rgba(60,141,247, 0.5)',
    '@media (max-width: 599px)': {
      width: 100,
      height: 150,
    },
    '@media (min-width: 600px)': {
      width: 180,
      height: 270,
    },
  },
})

export default CardFrame
