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
        '@media (max-width: 599px)': {
            width: 100,
            height: 140,
        },
        '@media (min-width: 600px)': {
            width: 250,
            height: 375,
        },
    }
});

export default CardFrame;