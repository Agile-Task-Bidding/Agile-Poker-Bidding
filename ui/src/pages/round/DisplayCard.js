import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import { Typography, TextField, Button, ButtonBase } from '@material-ui/core'
import { Done } from '@material-ui/icons'
import CardFrame from '../../components/CardFrame'

const DisplayCard = ({ card, setCard, deleteCard, selected, onClick }) => {
  return (
    <ButtonBase onClick={onClick} style={{ textDecoration: 'none' }}>
      <CardFrame elevation={1} className={css(styles.container)}>
        <Typography
          variant='h1'
          style={{
            color: '#2752B6',
          }}
        >
          {card.value}
        </Typography>
        <Typography
          variant='h4'
          style={{
            color: '#223496',
          }}
        >
          {card.tag}
        </Typography>
      </CardFrame>
      {selected ? (
        <div className={css(styles.overlay)}>
          <Done />
        </div>
      ) : null}
    </ButtonBase>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    justifyItems: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
})

export default DisplayCard
