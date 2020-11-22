import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Typography, TextField } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { roomServiceSocketSelector } from '../data/state/room-service/room-service.selectors';
import {
    createRoomServiceConnection,
    emitEvent,
} from '../data/state/room-service/room-service.actions';
import firebase from 'firebase';
import { firebaseConfig } from '../firebaseConfig';

firebase.initializeApp(firebaseConfig);
console.log('Current User:', firebase.auth().currentUser);

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
        },
        cardIndex: '',
        authToken: '',
        email: '',
        password: '',
    };

    async componentDidMount() {
        await this.props.createRoomServiceConnection();

        this.props.roomServiceSocket.on('room_inactive', event => this.onRoomInactive(event));
        this.props.roomServiceSocket.on('user_already_in_room', event => this.onUserAlreadyInRoom(event));
        this.props.roomServiceSocket.on('room_state_changed', event => this.onRoomStateChanged(event));
        this.props.roomServiceSocket.on('join_success', event => this.onJoinSuccess(event));
        this.props.roomServiceSocket.on('not_in_room_error', event => this.onNotInRoomError(event));
        this.props.roomServiceSocket.on('vote_success', event => this.onVoteSuccess(event));
        this.props.roomServiceSocket.on('vote_cancel_success', event => this.onVoteCancelSuccess(event));
        this.props.roomServiceSocket.on('room_already_created', event => this.onRoomAlreadyCreated(event));
        this.props.roomServiceSocket.on('create_success', event => this.onCreateSuccess(event));
        this.props.roomServiceSocket.on('host_room_closed_failure', event => this.onHostRoomClosedFailure(event));
        this.props.roomServiceSocket.on('host_closed_connection', event => this.onHostClosedConnection(event));
        this.props.roomServiceSocket.on('host_room_closed_success', event => this.onHostRoomClosedSuccess(event));
        this.props.roomServiceSocket.on('not_authorized', event => this.onNotAuthorized(event));
    }

    onNotAuthorized(event) {
        console.log(event);
    }

    onRoomInactive(event) {
        console.log('The room you have attempted to join DNE or is inactive.');
    }

    onUserAlreadyInRoom(event) {
        console.log('You are already in the room you have attempted to join.');
    }

    onRoomStateChanged(event) {
        this.setState({
            roomState: event.roomState
        });
    }

    onJoinSuccess(event) {
        console.log('You have successfully joined the room.');
    }

    onNotInRoomError(event) {
        console.log('You are not in the room and cannot take that action.');
    }

    onVoteSuccess(event) {
        console.log('You have successfully voted.');
    }
    
    onVoteCancelSuccess(event) {
        console.log('You have successfully cancelled your vote.');
    }

    onRoomAlreadyCreated(event) {
        console.log('This room has already been created.');
    }

    onCreateSuccess(event) {
        console.log('You have successfully created the room.');
    }

    onHostRoomClosedFailure(event) {
        console.log('Failed to close the room.');
    }

    onHostClosedConnection(event) {
        console.log('The host has closed your connection to the server.');
        this.setState({
            roomState: null,
        });
    }

    onHostRoomClosedSuccess(event) {
        console.log('You have successfully closed the room.');
    }

    renderAvailableCards() {
        if (this.state.roomState) {
            const options = [];
            for (const card of this.state.roomState.deck) {
                options.push(<li>{card.tag}, {card.value}</li>);
            }
            return options;
        } else {
            return <li>There are no cards available.</li>
        }
    }

    renderConnectedUsers() {
        if (this.state.roomState) {
            const users = [];
            for (const userID in this.state.roomState.connectedUsersByID) {
                const user = this.state.roomState.connectedUsersByID[userID];
                users.push(<li>{user.nickname}</li>);
            }
            return users;
        } else {
            return <li>There are no connected users.</li>
        }
    }

    renderCurrentRoomPhase() {
        let roomPhase = 'None';
        if (this.state.roomState) {
            if (this.state.roomState.phase === 'VOTING_PHASE') {
                roomPhase = 'Voting';
            } else if (this.state.roomState.phase === 'RESULTS_PHASE') {
                roomPhase = 'Results';
            }
        }
        return 'Current Room Phase: ' + roomPhase;
    }

    render() {
        return (
            <>
                <div>
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
                </div>
                <div>
                    <TextField
                        placeholder={'Email'}
                        value={this.state.email}
                        onChange={event => this.setState({ email: event.target.value })}
                    />
                    <TextField
                        placeholder={'Password'}
                        value={this.state.password}
                        onChange={event => this.setState({ password: event.target.value })}
                    />
                    <Button
                        onClick={async () => {
                            const result = await firebase.auth().signInWithEmailAndPassword(
                                this.state.email,
                                this.state.password
                            ).catch(err => console.log(err));
                            if (firebase.auth().currentUser) {
                                const authToken = await firebase.auth().currentUser.getIdToken(true)
                                    .catch(err => console.log(err));
                                this.setState({
                                    authToken,
                                });
                                console.log('"Signed in" successfully!');
                            }
                        }}
                    >
                        Login
                    </Button>
                    <Button
                        onClick={async () => {
                            const result = await firebase.auth().signOut()
                                .catch(err => console.log(err));
                            console.log('Signed out successfully!');
                        }}
                    >
                        Sign Out
                    </Button>
                </div>
                <div>
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
                                    authToken: this.state.authToken,
                                }
                            )
                        }}
                    >
                        Create Room
                    </Button>
                    <Button
                        onClick={() => {
                            this.props.emitEvent(
                                'close_room',
                                {
                                    roomID: this.state.hostRoomID,
                                    authToken: this.state.authToken,
                                }
                            );
                        }}
                    >
                        Close Room
                    </Button>
                </div>
                <div>
                    <TextField
                        placeholder={'Card Index'}
                        value={this.state.cardIndex}
                        onChange={event => this.setState({ cardIndex: event.target.value })}
                    />
                    <Button
                        onClick={() => {
                            this.props.emitEvent(
                                'user_vote',
                                {
                                    roomID: this.state.joinRoomID,
                                    cardIndex: parseInt(this.state.cardIndex),
                                }
                            );
                        }}
                    >
                        Vote
                    </Button>
                    <Button
                        onClick={() => {
                            this.props.emitEvent(
                                'user_cancel_vote',
                                {
                                    roomID: this.state.joinRoomID,
                                }
                            );
                        }}
                    >
                        Cancel Vote
                    </Button>
                    <Typography>The above field accepts numbers only.</Typography>
                </div>
                <div>
                    <ul>
                        Available cards:
                        {this.renderAvailableCards()}
                    </ul>
                </div>
                <div>
                    <Button
                        onClick={() => {
                            this.props.emitEvent(
                                'start_new_round',
                                {
                                    roomID: this.state.joinRoomID,
                                    authToken: this.state.authToken,
                                }
                            );
                        }}
                    >
                        Start New Round
                    </Button>
                    <Button
                        onClick={() => {
                            this.props.emitEvent(
                                'force_end_bidding',
                                {
                                    roomID: this.state.joinRoomID,
                                    authToken: this.state.authToken,
                                }
                            );
                        }}
                    >
                        Force End Bidding
                    </Button>
                </div>
                <div>
                    <ul>
                        List of users in room:
                        {this.renderConnectedUsers()}
                    </ul>
                </div>
                <div>
                    {this.renderCurrentRoomPhase()}
                </div>
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
