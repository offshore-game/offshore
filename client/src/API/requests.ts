import { io, Socket } from "socket.io-client";
import { validateTokenEnums } from "./types/enums";

export default class Requests {

    socket: Socket

    constructor() {

        this.socket = io("http://localhost:8080"); // Establish a connection

    }

    // Attempt to reauthenticate into a lobby incase of a reload.
    async rejoinLobby() {
        return new Promise((res, rej) => {

            const token = localStorage.getItem("token")!
            const roomCode = localStorage.getItem("roomCode")

            this.socket.emit("rejoinLobby", { token: token, roomCode: roomCode }, (result: boolean) => {

                if (result) {

                    res(true); // Success

                } else {

                    localStorage.setItem("token", "") // Wipe the old invalid token
                    localStorage.setItem("roomCode", "") // Wipe the old room code

                    rej(false); // Error occured

                }

            })


        })
    }

    // Attempt to join a lobby on request.
    async joinLobby(username: string, roomCode: string) {
        return new Promise((res, rej) => {

            this.socket.emit("joinLobby", { username: username, roomCode: roomCode }, (token: string) => {
                console.log(token)
                if (token) {

                    localStorage.setItem("token", token)
                    localStorage.setItem("roomCode", roomCode)
                    res(true); // Success

                } else {

                    rej(false); // Error occured

                }

            })

        })
    }

    // Attempt to create a new lobby on request.
    async createLobby(username: string) {
        return new Promise((res, rej) => {

            this.socket.emit("createLobby", { username: username }, (result: { token: string, roomCode: string }) => {

                if (result) {

                    localStorage.setItem("token", result.token)
                    localStorage.setItem("roomCode", result.roomCode)
                    res(true); // Success

                } else {

                    rej(false); // Error occured

                }

            })

        })
    }

    async validateToken(token: string, roomCode: string): Promise<validateTokenEnums> {
        return new Promise((res, rej) => {

            this.socket.emit("validateToken", { token: token, roomCode: roomCode }, (result: validateTokenEnums) => {

                res(result);

            })

        })
    }

}