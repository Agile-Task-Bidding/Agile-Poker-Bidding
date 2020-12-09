import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dialog } from '@material-ui/core';
import ReactPlayer from "react-player";
import { rickRollPlayingSelector } from '../../data/state/rick-rolled/rick-rolled.selector';
import { setRickRollPlaying } from '../../data/state/rick-rolled/rick-rolled.actions';

const RickRolled = ({ rickRollPlaying, setRickRollPlaying }) => {

    const [forceWait, setForceWait] = useState(true)
    const [open, setOpen] = useState(true);

    useEffect(() => {
        setTimeout(() => setForceWait(false), 1.5 * 2000);
    }, []);

    return (
        <Dialog open={open} onClose={() => {
            if (!forceWait) {
                setForceWait(true)
                setOpen(false)}
            }
        }>
            <ReactPlayer url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" width={560} height={315} playing={true} style={{ overflowX: 'hidden', overflowY: 'hidden' }} />
        </Dialog>
    )
};

const mapStateToProps = (state) => {
    return {
        rickRollPlaying: rickRollPlayingSelector(state),
    }
};

const mapDispatchToProps = {
    setRickRollPlaying,
}

export default connect(mapStateToProps, mapDispatchToProps)(RickRolled);