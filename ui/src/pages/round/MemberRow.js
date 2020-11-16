import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import { Button, Typography } from '@material-ui/core';
import { accountSelector } from '../../data/state/account/account.selector';

const MemberRow = ({ account, displayName, vote }) => {
    return (
        <div className={css(styles.container)}>
            <Typography>{displayName}</Typography>
            { vote ? <Typography>{vote}</Typography> : <Typography>Not voted</Typography>}
            { account ? <Button>Kick</Button> : null}
        </div>
    )
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
    }
});

const mapStateToProps = (state) => {
    return {
        account: accountSelector(state)
    }
}

export default MemberRow;