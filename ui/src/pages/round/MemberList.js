import React from 'react';
import { connect } from 'react-redux';
import { accountSelector } from '../../data/state/account/account.selector';
import MemberRow from './MemberRow';
import { roundStateSelector } from '../../data/state/round-state/round-state.selector';
import { StyleSheet, css } from 'aphrodite';
import { Paper } from '@material-ui/core';

const MemberList = ({ roundState, account, className, ...thruProps }) => {
    const players = Object.values(roundState.connectedUsersByID).map(({ nickname, socketID }) => {
        const vote = roundState.voteByUserID[socketID];
        return (
            <MemberRow displayName={nickname} vote={vote}/>
        )
      });
    return (
        <Paper className={css(styles.container) + (className ? ' ' + className : '')} {...thruProps}>
            {players}
        </Paper>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridRowGap: '12px',
    }
})

const mapStateToProps = (state) => {
    return {
        roundState: roundStateSelector(state),
        account: accountSelector(state),
    }
};

export default connect(mapStateToProps, {})(MemberList);