import React from 'react';
import { Container } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';

const ResponsiveContainer = ({...thruProps}) => {
    return (
        <div className={css(styles.container)} {...thruProps}></div>
    );
};

const styles = StyleSheet.create({
    container: {
        // '@media (max-width: 959px)': {
        //     paddingLeft: 0,
        //     paddingRight: 0,
        // },
        // background: 'gray',
        minHeight: '100vh', //TODO figure out how to remove padding from body and why the other page does it
        padding: 24,
    }
})

export default ResponsiveContainer;