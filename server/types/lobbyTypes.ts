import { Socket } from "socket.io"

export type playerType = {
    token: string,
    username: string,
    role: "READER" | "SOLVER",
    socket: Socket | undefined,
}

export type lobbyMapEntry = {
    id: string,
    players: playerType[],
    phase: "LOBBY" | "ROUND" | "END",
    events: {
        // We need various game phases to go in here.
    },
}
