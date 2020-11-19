import React from 'react';
import { Container } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';

const ResponsiveContainer = ({...thruProps}) => {
    return (
        <div className={css(styles.page)}>
            <Container className={css(styles.container)} {...thruProps}></Container>
        </div>
    );
};

const styles = StyleSheet.create({
    // page: {
    //     backgroundColor: '#eeeeff',
    // },
    container: {
        '@media (max-width: 599px)': {
            paddingLeft: 0,
            paddingRight: 0,
        },
        // background: 'gray',
        minHeight: '100vh', //TODO figure out how to remove padding from body and why the other page does it
    }
})

export default ResponsiveContainer;