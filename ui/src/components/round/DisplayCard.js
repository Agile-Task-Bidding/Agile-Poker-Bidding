import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import { Typography, TextField, Button, ButtonBase } from '@material-ui/core'
import { Done } from '@material-ui/icons'
import CardFrame from '../../components/CardFrame'
import PilePlanIcon from '../icon/PilePlanIcon'

const DisplayCard = ({ card, selected, onClick }) => {
  return (
    <CardFrame elevation={1}>
      <ButtonBase className={css(styles.container)} onClick={onClick} style={{ textDecoration: 'none' }}>
        <Typography
          variant='h1'
          style={{
            color: '#2752B6',
          }}
        >
          { (card.value == 'ABSTAIN' ) ? (
            <PilePlanIcon fontSize='large'/>
          ) : 
            (card.value)
          }
        </Typography>
        <Typography
          variant='h4'
          style={{
            color: '#223496',
          }}
        >
          {card.tag}
        </Typography>
        {selected ? (
          <div className={css(styles.overlay)}>
            <Done />
          </div>
        ) : null}
      </ButtonBase>
    </CardFrame>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    justifyItems: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
})

export default DisplayCard
