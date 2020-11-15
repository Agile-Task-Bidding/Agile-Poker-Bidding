export function roomServiceSocketSelector(state) {
    return state.roomService.socket;
}

export function connectedToRoomSelector(state) {
    return state.roomService.connectedToRoom;
}