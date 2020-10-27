import React, { useState } from 'react';
import { css, StyleSheet } from 'aphrodite';
import { TextField, Paper, Button, Link } from '@material-ui/core';
import PilePlanIcon from '../components/PilePlanIcon';
import HorizontalCenterContainer from '../components/container/HorizontalCenterContainer';
import LoginRegisterSwitchEnum from './LoginRegisterSwitchEnum'

const RegisterCard = ({setMode}) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <Paper elevation={2} className={css(styles.container)}>
            <HorizontalCenterContainer>
                <PilePlanIcon style={{fontSize: 50}}/>
            </HorizontalCenterContainer>
            <form style={{ display: 'grid', gridTemplateColumns: '1fr', gridRowGap: 12 }}>
                <TextField 
                    id="email" 
                    label="Email" 
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                />
                <TextField 
                    id="username" 
                    label="Username" 
                    value={username}
                    onChange={event => setUsername(event.target.value)}
                />
                <TextField 
                    id="password" 
                    label="Password" 
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                />
                <Button variant='contained' type='submit'>Register</Button>
            </form>
            <HorizontalCenterContainer>
                <Button
                    onClick={event => {
                        setMode(LoginRegisterSwitchEnum.LOGIN_STATE)
                    }}
                >Login</Button>
            </HorizontalCenterContainer>
        </Paper>
    )
};

const styles = StyleSheet.create({
    container: {
        padding: 12,
        width: 400,
        maxWidth: '100%',
    },
});

export default RegisterCard;