import * as http from 'http'
import socket, { Server } from 'socket.io' // https://socket.io/docs/v4

// https://socket.io/docs/v4/rooms/


const io = new Server(8080, {
    cors: {
        origin: "http://localhost:3000"
    }
})

io.sockets.on("connection", function (socket) {

    console.debug("client connected")

    socket.on("validateToken", function (data, callback) {

        console.debug(data)
        if (data != "ABCD1234") return callback(false);

        // DEBUG: Add token validation and return result.
        callback(true) // validation result

    })

    socket.on("requestToken", function (callback) {
        // DEBUG: Add token creator

        return callback("ABCD1234") // Send the token to the client.
    })

})

/*io.on("connection", (socket) => {

    

})

io.on("recieveToken", (socket) => {
    console.debug('requested token server side')
    const token = "abCdETOKEN123"
    socket.emit('fetchToken', token)
})

io.on("validateToken", (socket, token) => {
    socket
    console.debug(`Validating Token ${token}`) // DEBUG
})*/




/*import express from 'express'
import getRoutes from './routes/get';

const app = express();
const port = 8000;

for (const route of getRoutes) {
    app.get(route.route, route.callback)
}

app.listen(port, () => {
    console.warn(`Server listening on port ${port}`)
})*/
