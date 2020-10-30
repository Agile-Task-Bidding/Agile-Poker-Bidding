import React from 'react';
import { Typography, TextField, Button } from '@material-ui/core'
import CardFrame from './CardFrame';

const EditCard = ({ card, setCard, deleteCard }) => {
    return (
        <CardFrame elevation={1}>
            <TextField value={card.number} onChange={(event) => setCard({...card, number: event.target.value})}>Value</TextField>
            <TextField value={card.hint} onChange={(event) => setCard({...card, hint: event.target.value})}>Hint</TextField>
            <Button onClick={() => deleteCard()}>Delete</Button>
        </CardFrame>
    );
};

export default EditCard;