import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import { Container, Grid, Paper, Typography } from '@material-ui/core'

const EditCardGrid = ({children}) => {
    const items = children.map((it, idx) => (
        <Grid key={idx} item xs={6} sm={6} md={4} lg={3} xl={3} className={css(styles.cardHolder)}>{it}</Grid>
    ))
    return (
        <Grid container justify="flex-start" spacing={2}>
            {items}
        </Grid>
    )
};

const styles = StyleSheet.create({
    cardHolder: {
        display: 'flex', 
        justifyContent: 'center',
    }
});


export default EditCardGrid;