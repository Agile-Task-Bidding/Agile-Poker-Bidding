import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import { Button, Typography, Paper } from '@material-ui/core';
import { accountSelector } from '../../data/state/account/account.selector';

const MemberRow = ({ account, displayName, vote }) => {
    return (
        <div className={css(styles.container)}>
            <Typography>{displayName}</Typography>
            { vote != null ? <Typography>{vote}</Typography> : <Typography>Not voted</Typography>}
            { account ? <Button>Kick</Button> : null}
        </div>
    )
};

const styles = StyleSheet.create({
    container: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr',
        justifyContent: 'flex-start'
    }
});

const mapStateToProps = (state) => {
    return {
        account: accountSelector(state)
    }
}

export default MemberRow;