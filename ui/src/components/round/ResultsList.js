import React from 'react'
import { connect } from 'react-redux'
import { accountSelector } from '../../data/state/account/account.selector'
import ResultRow from './ResultRow'
import { roundStateSelector } from '../../data/state/round-state/round-state.selector'
import { StyleSheet, css } from 'aphrodite'
import { Paper, List, ListItem, Typography, Divider } from '@material-ui/core'

const ResultsList = ({ roundState, account, className, ...thruProps }) => {
  const players = Object.values(roundState.connectedUsersByID).map(
    ({ nickname, socketID }) => {
      const vote = roundState.voteByUserID[socketID]
      const voteValue = (vote !== undefined && vote !== null) ? roundState.deck[vote].value : '-1'
      return (
        <React.Fragment key={socketID}>
          <ListItem>
            <ResultRow key={socketID} displayName={nickname} vote={voteValue} />
          </ListItem>
          <Divider />
        </React.Fragment>
      )
    }
  )

  return (
    <Paper
      className={css(styles.container) + (className ? ' ' + className : '')}
      {...thruProps}
    >
      <div>
        <Typography variant='h4' color='primary' align='center'>
          Users' Cards
        </Typography>
        <Divider />
      </div>
      <List style={{ color: 'black' }}>{players}</List>
    </Paper>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
})

const mapStateToProps = (state) => {
  return {
    roundState: roundStateSelector(state),
    account: accountSelector(state),
  }
}

export default connect(mapStateToProps, {})(ResultsList)
