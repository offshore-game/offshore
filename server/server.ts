import { Server } from 'socket.io' // https://socket.io/docs/v4
import { lobbyMapEntry } from './types/lobbyTypes'
import { lobbyEntry } from './tests/payloads'
import { validateTokenEnums } from './types/enums'
import GameLobby from './classes/GameLobby/GameLobby'

// https://socket.io/docs/v4/rooms/


const io = new Server(8080, {
    cors: {
        origin: "http://localhost:3000"
    }
})


const lobbies = new Map<string, GameLobby>()
    lobbies.set(lobbyEntry.id, lobbyEntry) // TESTING


io.sockets.on("connection", function (socket) {

    console.debug("client connected")

    socket.on("rejoinLobby", async function (data: { token: string, roomCode: string }, callback) {

        const lobby = lobbies.get(data.roomCode)
        if (lobby) {

            for (const player of lobby.players) {

                if (player.token == data.token) {

                    // On rejoin (page refresh), a new socket is made, so we need to update it.
                    player.socket = socket

                    // Add the player back to the lobby
                    await socket.join(data.roomCode)

                    return callback(true);

                }

            }

        }

        return callback(false); // If all fails...

    })


    socket.on("createLobby", async function (data: { username: string }, callback) {

        const lobby = new GameLobby()
            lobbies.set(lobby.id, lobby) // Add to lobby map

        const result = await lobby.addPlayer(data.username, socket).catch((err) => { return callback(err) })

        return callback(result.token) // Return the token

    })


    socket.on("joinLobby", async function (data: { username: string, roomCode: string }, callback) {

        const lobby = lobbies.get(data.roomCode)!

        if (lobby) {
            
            const player = await lobby.addPlayer(data.username, socket).catch((err) => { return callback(err) })
            return callback(player.token) // Return the token

        }

    })

    socket.on("validateToken", function (data: { token: string, roomCode: string }, callback) {

        const lobby = lobbies.get(data.roomCode)

        if (lobby) {

            for (const player of lobby.players) {

                if (player.token == data.token) {

                    // A user was found within this lobby.
                    return callback(validateTokenEnums.VALID)

                }

            }
            
            // User with that token was not found inside the given lobby.
            return callback(validateTokenEnums.TOKEN_INVALID) // DEBUG: not sure if this causes problems?

        } else {

            // Lobby doesn't exist.
            return callback(validateTokenEnums.ROOM_INVALID)

        }

    })

})


io.sockets.adapter.on("join-room", (room, id) => {
    console.log(`Socket of id ${id} joined room ${room}`)
})

io.sockets.adapter.on("leave-room", async (roomId, socketId) => {

    console.log(`Socket of id ${socketId} left room ${roomId}`)

    const lobby = lobbies.get(roomId)

    if (lobby) {

        const player = lobby.players.find(player => player.socketId == socketId)
        if (player) {

            // Mark the player as disconnected
            player.connected = false

        }

    }

})
