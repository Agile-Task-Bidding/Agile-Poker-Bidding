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
    // border: '0.3em solid white',
    '@media (max-width: 959px)': {
      width: 140,
      height: 140*3/2,
    },
    '@media (min-width: 960px)': {
      width: 180,
      height: 180*3/2,
    },
  },
})

export default CardFrame
