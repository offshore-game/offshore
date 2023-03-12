import { Socket } from "socket.io"
import * as crypto from 'node:crypto'


function generateToken() {
    return crypto.randomBytes(256).toString('hex')
}


export default class Player {

    token: string
    username: string
    role: "READER" | "SOLVER" | undefined
    socketId: string
    socket: Socket | undefined
    connected: boolean
    owner: boolean
    points: number

    constructor(username: string, socket: Socket, isOwner?: boolean) {

        this.token = generateToken()
        this.username = username
        this.role = undefined
        this.socket = socket
        this.socketId = socket.id
        this.connected = true
        this.owner = isOwner ? true : false
        this.points = 0

    }

    changePoints(valueToAdd: number) {

        // Change the points internally
        this.points = this.points + valueToAdd

        // Tell the player their points changed
        this.socket.emit("pointsChanged", { newPoints: this.points })

    }

}
