import React from 'react'
import PilePlanIcon from '../icon/PilePlanIcon'
import { StyleSheet, css } from 'aphrodite'
import { Typography } from '@material-ui/core'
import CardFrame from '../CardFrame'

const CoffeeCard = () => {
  return (
      <CardFrame elevation={1} className={css(styles.container)}>
        <Typography variant='h3'>
          <PilePlanIcon color='primary' fontSize='large'/>
        </Typography>
        <Typography
          variant='h5'
          // style={{
          //   color: '#223496',
          // }}
          color='primary'
        >
          Abstain
        </Typography>
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

export default CoffeeCard
