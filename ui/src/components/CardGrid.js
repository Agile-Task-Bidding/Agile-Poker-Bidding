import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import { Container, Grid, Paper, Typography } from '@material-ui/core'

const CardGrid = ({children, className, ...passThruProps}) => {
    return (
        <div className={css(styles.centerContainer)}>
            <div className={css(styles.cardHolder) + (className ? ` ${className}`: ``)} justify="flex-start" spacing={2} {...passThruProps}>
                {children}
            </div>
        </div>
    )
};

const styles = StyleSheet.create({
    cardHolder: {
        display: 'grid',
        gridGap: 24,
        '@media (max-width: 959px)': {
            gridTemplateColumns: '1fr 1fr',
        },
        '@media (min-width: 960px) and (max-width: 1279px)': {
            gridTemplateColumns: '1fr 1fr 1fr',
        },
        '@media (min-width: 1280px)': {
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
        },
    },
    centerContainer: {
        display: 'flex',
        justifyContent: 'center',
    }
});


export default CardGrid;