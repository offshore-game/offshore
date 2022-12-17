import * as http from 'http'
import socket, { Server } from 'socket.io' // https://socket.io/docs/v4

// https://socket.io/docs/v4/rooms/


const io = new Server(8080, {
    cors: {
        origin: "http://localhost:3000"
    }
})

io.on("connection", (socket) => {

    console.debug("client connected, new token...")
    const token = "abCdETOKEN123"
    socket.emit("fetchToken", token)

})

io.on("requestToken", (socket) => {
    console.debug('requested token server side')
    socket.emit('returnToken', 'your token')
})


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
