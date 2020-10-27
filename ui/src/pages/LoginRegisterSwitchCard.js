import React, { useState } from 'react';
import LoginRegisterSwitchEnum from './LoginRegisterSwitchEnum';
import LoginCard from './LoginCard';
import RegisterCard from './RegisterCard';

const LoginRegisterSwitchCard = () => {
    const [mode, setMode] = useState(LoginRegisterSwitchEnum.LOGIN_STATE);

    return mode === LoginRegisterSwitchEnum.LOGIN_STATE ? (
        <LoginCard setMode={setMode}/>
    ) : (
        <RegisterCard setMode={setMode}/>
    );
};

export default LoginRegisterSwitchCard;