import { lobbyMapEntry } from "../types/lobbyTypes";

export const lobbyEntry: lobbyMapEntry = {
    id: "AAAA",
    players: [
        {
            token: "token",
            username: "Player One",
            role: "READER",
            socket: undefined
        },
        {
            token: "to",
            username: "Player Two",
            role: "SOLVER",
            socket: undefined
        },
        {
            token: "ke",
            username: "Player Three",
            role: "SOLVER",
            socket: undefined
        },
        {
            token: "nt",
            username: "Player Four",
            role: "SOLVER",
            socket: undefined
        },
    ],
    phase: "LOBBY", // Generally, default phase.
    events: {

    },
}
