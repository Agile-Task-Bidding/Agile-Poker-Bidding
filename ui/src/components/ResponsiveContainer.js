import React from 'react';
import { Container } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';

const ResponsiveContainer = ({...thruProps}) => {
    return (
        <Container maxWidth="md" className={css(styles.container)} {...thruProps}></Container>
    );
};

const styles = StyleSheet.create({
    container: {
        '@media (max-width: 600px)': {
            paddingLeft: 0,
            paddingRight: 0,
        },
        backgroundColor: '#eeeeff',
    }
})

export default ResponsiveContainer;