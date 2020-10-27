import React from 'react';
import HorizontalCenterContainer from '../components/container/HorizontalCenterContainer';
import VerticalSlotContainer from '../components/container/VerticalSlotContainer';
import LoginRegisterSwitchCard from './LoginRegisterSwitchCard';

const LoginPage = () => {
    return (
        <HorizontalCenterContainer>
            <VerticalSlotContainer>
                <LoginRegisterSwitchCard/>
            </VerticalSlotContainer>
        </HorizontalCenterContainer>
    )
};

export default LoginPage;