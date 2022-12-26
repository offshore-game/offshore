import { Socket } from "socket.io"

export type playerType = {
    token: string,
    username: string,
    role: "READER" | "SOLVER",
    socketId: string,
    socket: Socket | undefined,
    connected: boolean,
}

export type lobbyMapEntry = {
    id: string,
    players: playerType[],
    phase: "LOBBY" | "ROUND" | "END",
    events: {
        // We need various game phases to go in here.
    },
}
