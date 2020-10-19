import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';

class HomePage extends Component {
    state = {

    };

    render() {
        return (
            <Typography
                variant='h5'
                className={css(styles.headerText)}
            >
                Hi!
            </Typography>
        );
    }
}

const styles = StyleSheet.create({
    headerText: {
        color: 'blue',
        background: 'red',
    }
});

export default HomePage;