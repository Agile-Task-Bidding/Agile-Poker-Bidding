import React from 'react'
import { Button, IconButton } from '@material-ui/core'
import CardFrame from '../CardFrame'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import { StyleSheet, css } from 'aphrodite'

const AddCard = ({ onClick }) => {
  return (
    <CardFrame elevation={1} className={css(styles.container)}>
      <IconButton onClick={onClick}>
        <AddCircleOutlineIcon color='primary' />
      </IconButton>
    </CardFrame>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyItems: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default AddCard
