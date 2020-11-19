import React from 'react';
import { connect } from 'react-redux';
import { accountSelector } from '../../data/state/account/account.selector';
import MemberRow from './MemberRow';
import { roundStateSelector } from '../../data/state/round-state/round-state.selector';
import { StyleSheet, css } from 'aphrodite';
import { Paper, List, ListItem } from '@material-ui/core';

const MemberList = ({ roundState, account, className, ...thruProps }) => {
    const players = Object.values(roundState.connectedUsersByID).map(({ nickname, socketID }) => {
        const vote = roundState.voteByUserID[socketID];
        return (
            <ListItem>
                <MemberRow key={socketID} displayName={nickname} socketID={socketID} voted={vote !== null}/>
            </ListItem>
        )
      });
    return (
        <Paper className={css(styles.container) + (className ? ' ' + className : '')} {...thruProps}>
            <List>
                {players}
            </List>
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