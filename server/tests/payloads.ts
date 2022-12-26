import GameLobby from "../classes/GameLobby/GameLobby";

export const lobbyEntry = new GameLobby()

lobbyEntry.id = "AAAA"
lobbyEntry.players = [
    {
        token: "token",
        username: "Player One",
        role: "READER",
        socketId: "socket1",
        socket: undefined,
        connected: true,
    },
    {
        token: "to",
        username: "Player Two",
        role: "SOLVER",
        socketId: "socket1",
        socket: undefined,
        connected: true,
    },
    {
        token: "ke",
        username: "Player Three",
        role: "SOLVER",
        socketId: "socket1",
        socket: undefined,
        connected: false,
    },
    {
        token: "nt",
        username: "Player Four",
        role: "SOLVER",
        socketId: "socket1",
        socket: undefined,
        connected: false,
    },
]
