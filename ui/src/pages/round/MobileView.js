import React, { useState } from 'react';
import { StyleSheet, css } from 'aphrodite';
import { Button, IconButton, Typography, Dialog, Slide, AppBar, Toolbar, List, ListItem, Divider, ListItemText } from '@material-ui/core';
import { Menu, Close } from '@material-ui/icons';

const MobileView = ({ primary, secondary }) => {

    const [open, setOpen] = useState(false);

    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });

    return (
        <div>
            {primary}
            <div className={css(styles.overlay)}>
                <IconButton onClick={() => setOpen(true)}>
                    <Menu/>
                </IconButton>
            </div>
            <Dialog fullScreen open={open} onClose={() => setOpen(false)}>
                <AppBar className={css(styles.appbar)}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={() => setOpen(false)} aria-label="close">
                        <Close />
                        </IconButton>
                        <Typography variant="h6">
                        Users
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Toolbar/>
                {secondary}
            </Dialog>
        </div>
    )
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 12,
        right: 12,
    },
    appBar: {
        // position: 'relative',
    }
})

export default MobileView;