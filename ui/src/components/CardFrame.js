import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import { Paper } from '@material-ui/core'

const CardFrame = ({children, className, ...thruProps}) => {
    return (
        <Paper className={css(styles.card) + (className ? ' ' + className : '')} elevation={1} {...thruProps}>
            {children}
        </Paper>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: '1em',
        background: '#CBE1F7',
        border: '0.5em solid rgba(0, 0, 0, 0.25)',
        '@media (max-width: 599px)': {
            width: 100,
            height: 150,
        },
        '@media (min-width: 600px)': {
            width: 200,
            height: 300,
        },
    }
});

export default CardFrame;