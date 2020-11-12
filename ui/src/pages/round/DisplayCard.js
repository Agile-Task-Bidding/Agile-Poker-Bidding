import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import { Typography, TextField, Button, ButtonBase } from '@material-ui/core'
import CardFrame from '../../components/CardFrame';

const DisplayCard = ({ card, setCard, deleteCard, onClick }) => {
    return (
        <ButtonBase 
            onClick={onClick} 
            style={{ textDecoration: 'none' }}
        >
            <CardFrame elevation={1} className={css(styles.container)}>
                <Typography variant='h1'>{card.number}</Typography>
                <Typography variant='h5'>{card.hint}</Typography>
            </CardFrame>
        </ButtonBase>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        justifyItems: 'center',
        alignItems: 'center',
    }
});

export default DisplayCard;