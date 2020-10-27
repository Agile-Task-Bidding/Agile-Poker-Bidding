import React from 'react';
import { css, StyleSheet } from 'aphrodite';

const HorizontalSpreadContainer = ({children}) => {
    return (
        <div className={css(styles.container)}>{children}</div>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyItems: 'center',
        justifyContent: 'space-between',
    }
});

export default HorizontalSpreadContainer;