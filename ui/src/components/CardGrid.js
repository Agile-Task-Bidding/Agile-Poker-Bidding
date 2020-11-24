import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import { Container, Grid, Paper, Typography } from '@material-ui/core'

const CardGrid = ({children, className, ...passThruProps}) => {
    const items = children.map((it, idx) => (
        <Grid key={idx} item xs={6} sm={6} md={4} lg={3} xl={2} className={css(styles.cardHolder) + (className ? ` ${className}`: ``)}>{it}</Grid>
    ))
    return (
        <Grid container justify="flex-start" spacing={2} {...passThruProps}>
            {items}
        </Grid>
    )
};

const styles = StyleSheet.create({
    cardHolder: {
        display: 'flex', 
        justifyContent: 'center',
    },
});


export default CardGrid;