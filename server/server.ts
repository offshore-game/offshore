import { Server } from 'socket.io' // https://socket.io/docs/v4
import { lobbyMapEntry } from './types/lobbyTypes'
import { lobbyEntry } from './tests/payloads'

// https://socket.io/docs/v4/rooms/


const io = new Server(8080, {
    cors: {
        origin: "http://localhost:3000"
    }
})


const lobbies = new Map<string, lobbyMapEntry>()
    lobbies.set(lobbyEntry.id, lobbyEntry) // TESTING


io.sockets.on("connection", function (socket) {

    console.debug("client connected")

    socket.on("rejoinLobby", function (data: { token: string, roomCode: string }, callback) {

        const lobby = lobbies.get(data.roomCode)
        if (lobby) {

            for (const player of lobby.players) {

                if (player.token == data.token) {

                    // On rejoin (page refresh), a new socket is made, so we need to update it.
                    player.socket = socket
                    return callback(true);

                }

            }

        }

        return callback(false); // If all fails...

    })


    socket.on("createLobby", function (callback) {

        // DEBUG: Generate random four-letter ID
        const roomCode = "AAAA"

        socket.join(roomCode) // Subscribe the player to the lobby events (DEBUG: add the function below into here.)

        return callback(roomCode) // Return the room code

    })


    socket.on("joinLobby", function (data: { username: string, roomCode: string }, callback) {
        const username = data.username // DEBUG: check data to be valid and safe to use.
        const roomCode = data.roomCode

        const lobby = lobbies.get(roomCode)!

        if (lobby) {
            const token = "ABCD1234" // DEBUG: Generate random token
            const lobby = lobbies.get(roomCode)!

            for (const player of lobby.players) {

                if (player.username == username) {
                    console.debug("duplicate name!")
                    return;
                }

            }

            console.debug("joining lobby");

            lobby.players.push({
                token: token,
                username: username,
                role: "READER", // DEBUG: Randomly generate
                socket: socket,
            })

            socket.join(roomCode) // Subscribe the player to the lobby events
            
            return callback(token) // Return the token

        }

    })


})

io.sockets.adapter.on("join-room", (room, id) => {
    console.log(`Socket of id ${id} joined room ${room}`)
})
