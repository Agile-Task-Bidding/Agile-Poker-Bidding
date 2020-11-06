import React from 'react';
import { Button } from '@material-ui/core'
import CardFrame from './CardFrame';
import { StyleSheet, css } from 'aphrodite';

const AddCard = ({ onClick }) => {
    return (
        <CardFrame elevation={1} className={css(styles.container)}>
            <Button onClick={onClick}>+</Button>
        </CardFrame>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyItems: 'center',
        alignItems: 'center',
    }
});

export default AddCard;