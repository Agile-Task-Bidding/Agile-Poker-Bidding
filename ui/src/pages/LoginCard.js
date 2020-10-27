import React, { useState } from 'react';
import { css, StyleSheet } from 'aphrodite';
import { TextField, Paper, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import PilePlanIcon from '../components/PilePlanIcon';
import HorizontalCenterContainer from '../components/container/HorizontalCenterContainer';
import HorizontalSpreadContainer from '../components/container/HorizontalSpreadContainer';
import LoginRegisterSwitchEnum from './LoginRegisterSwitchEnum'

const LoginCard = ({setMode}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <Paper elevation={2} className={css(styles.container)}>
            <HorizontalCenterContainer>
                <PilePlanIcon style={{fontSize: 50}}/>
            </HorizontalCenterContainer>
            <form style={{ display: 'grid', gridTemplateColumns: '1fr', gridRowGap: 12 }}>
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
                <Button variant='contained' type='submit'>Login</Button>
            </form>
            <HorizontalSpreadContainer>
                <Button component={Link} to={'/forgot-password'}>Forgot Password</Button>
                <Button
                    onClick={event => {
                        setMode(LoginRegisterSwitchEnum.REGISTER_STATE);
                    }}
                >Sign Up</Button>
            </HorizontalSpreadContainer>
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

export default LoginCard;