import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import { Typography, TextField, Button } from '@material-ui/core'
import CardFrame from '../../components/CardFrame'

const EditCard = ({ card, valueError, setCard, deleteCard }) => {
  const getTextError = (code) => {
    if (code === 'error/falsy') return 'Value cannot be empty';
    if (code === 'error/nan') return 'Value must be a number';
    if (code === 'error/duplicate') return 'Value can only appear once';
    return 'Unknown error'
  }
  const trim = (text, maxLength) => {
    return text.substring(0, Math.min(text.length, maxLength));
  }
  return (
    <CardFrame elevation={1} className={css(styles.container)}>
      <TextField
        label='Value'
        inputProps={{ style: { textAlign: 'center' } }}
        value={`${card.value}`}
        helperText={valueError ? getTextError(valueError) : ''}
        error={!!valueError}
        onChange={(event) => setCard({ ...card, value: trim(event.target.value, 3) })}
        color='primary'
      />
      <TextField
        label='Tag'
        inputProps={{ style: { textAlign: 'center' } }}
        value={card.tag}
        onChange={(event) => setCard({ ...card, tag: trim(event.target.value, 15) })}
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
