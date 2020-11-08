import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Typography, TextField } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { roomServiceSocketSelector } from '../data/state/room-service/room-service.selectors';
import {
    createRoomServiceConnection,
    emitEvent,
} from '../data/state/room-service/room-service.actions';

class DemoPage extends Component {
    state = {
        joinRoomID: '',
        hostRoomID: '',
        nickname: '',
        roomState: null,
        roomConfig: {
            allowAbstain: true,
            deck: [
                {
                    tag: 'Ok',
                    value: 0,
                },
                {
                    tag: 'Test',
                    value: 1,
                },
                {
                    tag: 'Nice',
                    value: 2,
                }
            ]
        }
    };

    async componentDidMount() {
        await this.props.createRoomServiceConnection();

        this.props.roomServiceSocket.on('room_inactive', event => this.onRoomInactive(event));
    }

    onRoomInactive(event) {
        console.log('The room you have attempted to join DNE or is inactive.');
    }

    render() {
        return (
            <>
                <TextField
                    placeholder={'Join Room ID'}
                    value={this.state.joinRoomID}
                    onChange={event => this.setState({ joinRoomID: event.target.value })}
                />
                <TextField
                    placeholder={'Nickname'}
                    value={this.state.nickname}
                    onChange={event => this.setState({ nickname: event.target.value })}
                />
                <Button
                    onClick={() => {
                        this.props.emitEvent(
                            'join_room',
                            {
                                roomID: this.state.joinRoomID,
                                nickname: this.state.nickname
                            }
                        );
                    }}
                >
                    Join Room
                </Button>
                <TextField
                    placeholder={'Host Room ID'}
                    value={this.state.hostRoomID}
                    onChange={event => this.setState({ hostRoomID: event.target.value })}
                />
                <Button
                    onClick={() => {
                        this.props.emitEvent(
                            'create_room',
                            {
                                roomID: this.state.hostRoomID,
                                roomConfig: this.state.roomConfig,
                            }
                        )
                    }}
                >
                    Host Room
                </Button>
            </>
        );
    }
}

const styles = StyleSheet.create({
    
});

const mapStateToProps = (state) => {
    return {
        roomServiceSocket: roomServiceSocketSelector(state),
    }
};

const mapDispatchToProps = {
    createRoomServiceConnection,
    emitEvent,
}

export default connect(mapStateToProps, mapDispatchToProps)(DemoPage);
