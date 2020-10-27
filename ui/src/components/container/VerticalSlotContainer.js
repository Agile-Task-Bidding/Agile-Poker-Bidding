import React from 'react';
import { css, StyleSheet } from 'aphrodite';

const VerticalSlotContainer = ({children}) => {
    return (
        <div className={css(styles.container)}>{children}</div>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: '30vh',
    }
});

export default VerticalSlotContainer;