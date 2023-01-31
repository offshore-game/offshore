import { Server } from 'socket.io' // https://socket.io/docs/v4
import { lobbyEntry } from './tests/payloads'
import { globalErrors } from './types/enums'
import GameLobby from './classes/GameLobby/GameLobby'
import Player from './classes/Player'

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
        console.debug(`New lobby made with ID ${lobby.id}`)

        const player = await lobby.addPlayer(data.username, socket, true).catch((err) => { return callback(err) })
        console.debug("is owner?: ", player.owner)

        return callback({ token: player.token, roomCode: lobby.id }) // Return the payload

    })


    socket.on("joinLobby", async function (data: { username: string, roomCode: string }, callback) {

        const lobby = lobbies.get(data.roomCode)!

        if (lobby) {
            
            // Make an array of all other player usernames (before we add the new player)
            const otherPlayers: string[] = []
            for (const player of lobby.players) {
                otherPlayers.push(player.username)
            }

            const player = await lobby.addPlayer(data.username, socket).catch((err) => { return callback(err) })
            
            if (!player) return callback(false); // Return a boolean indicating a failure.
            
            console.debug("broadcasting that a player has joined")
            // Broadcast to all players that someone has joined.
            io.in(data.roomCode).emit("playerJoin", player.username)

            return callback({ token: player.token, otherPlayers: otherPlayers} ); // Return the payload
        }

    })

    socket.on("leaveLobby", async function (data: { token: string, roomCode: string }, callback) {

        const lobby = lobbies.get(data.roomCode)!

        if (lobby) {
            
            const player = await lobby.removePlayer(data.token).catch((err) => { return callback(false) }) as Player
                if (!player) return callback(false); // Return a boolean indicating a failure.

            player.socket?.leave(lobby.id) // De-register the player from the room events.
            
            console.debug(`Player ${player.username} has left lobby ${data.roomCode}`)

            // Broadcast to all players that someone has left.
            io.in(data.roomCode).emit("playerLeave", player.username)

            return callback(true); // Return a boolean indicating success.
            
        }

    })

    socket.on("validateToken", function (data: { token: string, roomCode: string }, callback) {

        const lobby = lobbies.get(data.roomCode)

        if (lobby) {

            for (const player of lobby.players) {

                if (player.token == data.token) {

                    // A user was found within this lobby.
                    return callback(globalErrors.VALID)

                }

            }
            
            // User with that token was not found inside the given lobby.
            return callback(globalErrors.TOKEN_INVALID) // DEBUG: not sure if this causes problems?

        } else {

            // Lobby doesn't exist.
            return callback(globalErrors.ROOM_INVALID)

        }

    })

    socket.on("startGame", function (data: { token: string, roomCode: string, ruleset?: { lengthSec: number, difficulty: "EASY" | "NORMAL" | "HARD" } }, callback ) {

        const lobby = lobbies.get(data.roomCode)

        if (lobby) {

            const player = lobby.players.find(player => player.token == data.token)

            // Player is the owner of the lobby
            if (player?.owner) {
                
                // Set lobby state to started
                lobby.state = "INGAME"


                // Communicate to all clients that the game has started
                io.in(lobby.id).emit("gameStart", {
                    // Send to the client the ruleset of the match.

                    lengthSec: 300, // 5 Minutes = 300 Seconds

                })


                // Return a success
                return callback(true);

            // Player is not the owner of the lobby
            } else {

                // Player is not allowed to perform this action.
                return callback(globalErrors.INSUFFICIENT_PERMS)

            }

        } else {

            // Lobby doesn't exist.
            return callback(globalErrors.ROOM_INVALID)

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

            // Check if the player is the owner of the lobby
            if (player.owner == true) {

                // Tell all clients to leave if the owner disconnects
                io.in(roomId).emit("lobbyClose")

                // Delete the lobby
                lobbies.delete(roomId)

                console.debug(`Room of ID ${roomId} destroyed due to inactivity.`)

            }

        }

        // Clear lobby if no connected players remain.
        const connectedPlayers = lobby.players.filter(player => player.connected == true)
        if (connectedPlayers.length == 0) {
            lobbies.delete(roomId)
        }

    }

})
