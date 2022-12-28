import { Socket } from "socket.io"
import crypto from 'node:crypto'


function generateToken() {
    return crypto.randomBytes(256).toString('hex')
}


export default class Player {

    token: string
    username: string
    role: "READER" | "SOLVER" | undefined
    socketId: string
    socket: Socket
    connected: boolean
    owner: boolean

    constructor(username: string, socket: Socket, isOwner?: boolean) {

        this.token = generateToken()
        this.username = username
        this.role = undefined
        this.socket = socket
        this.socketId = socket.id
        this.connected = true
        this.owner = isOwner ? true : false

    }



}