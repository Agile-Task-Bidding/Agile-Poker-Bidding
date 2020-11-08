import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import { Typography, TextField, Button } from '@material-ui/core'
import CardFrame from '../../components/CardFrame';


const EditCard = ({ card, setCard, deleteCard }) => {
    return (
        <CardFrame elevation={1} className={css(styles.container)}>
            <TextField value={card.number} onChange={(event) => setCard({...card, number: event.target.value})}>Value</TextField>
            <TextField value={card.hint} onChange={(event) => setCard({...card, hint: event.target.value})}>Hint</TextField>
            <Button onClick={() => deleteCard()}>Delete</Button>
        </CardFrame>
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

export default EditCard;