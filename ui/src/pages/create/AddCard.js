import React from 'react';
import { Button } from '@material-ui/core'
import CardFrame from './CardFrame';

const AddCard = ({ onClick }) => {
    return (
        <CardFrame elevation={1}>
            <Button onClick={onClick}>+</Button>
        </CardFrame>
    );
};

export default AddCard;