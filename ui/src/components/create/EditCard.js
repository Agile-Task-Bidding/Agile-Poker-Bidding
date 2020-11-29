import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import { Typography, TextField, Button } from '@material-ui/core'
import CardFrame from '../../components/CardFrame'

const EditCard = ({ card, setCard, deleteCard }) => {
  return (
    <CardFrame elevation={1} className={css(styles.container)}>
      <TextField
        label='Value'
        inputProps={{ style: { textAlign: 'center' } }}
        value={`${card.value}`}
        onChange={(event) => setCard({ ...card, value: Number(event.target.value) })}
        color='primary'
      />
      <TextField
        label='Tag'
        inputProps={{ style: { textAlign: 'center' } }}
        value={card.tag}
        onChange={(event) => setCard({ ...card, tag: event.target.value })}
      />
      <Button variant='contained' color='primary' onClick={() => deleteCard()}>
        Delete
      </Button>
    </CardFrame>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    justifyItems: 'center',
    alignItems: 'center',
  },
})

export default EditCard
