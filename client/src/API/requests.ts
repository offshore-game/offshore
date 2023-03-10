import { io, Socket } from "socket.io-client";
import { validateTokenEnums } from "./types/enums";

export type zoneNames = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j"
type puzzleTypes = "numberCombination" | "buttonCombination" | "buttonSpeed" | "wireConnect" | "wireCut"

export type startGamePayload = {
    lengthSec: number,
    puzzles: { 
        zoneName: zoneNames,
        type: puzzleTypes,
        numberCount?: number,
    }[]
}

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

                    return res(true); // Success

                } else {

                    localStorage.setItem("token", "") // Wipe the old invalid token
                    localStorage.setItem("roomCode", "") // Wipe the old room code

                    return rej(false); // Error occured

                }

            })


        })
    }

    // Attempt to join a lobby on request.
    async joinLobby(username: string, roomCode: string): Promise<string[]> {
        return new Promise((res, rej) => {

            this.socket.emit("joinLobby", { username: username, roomCode: roomCode }, (data: { token: string, otherPlayers: string[]}) => {
                console.log(data.token)
                if (data.token) {

                    localStorage.setItem("token", data.token)
                    localStorage.setItem("roomCode", roomCode)
                    localStorage.setItem("username", username)
                    localStorage.setItem("isOwner", "false") // Make sure the client doesn't get confused
                    
                    return res(data.otherPlayers); // Success

                } else {

                    return rej(false); // Error occured

                }

            })

        })
    }

    // Attempt to leave a lobby on request.
    async leaveLobby() {
        return new Promise((res, rej) => {
            
            const token = localStorage.getItem("token")
            const roomCode = localStorage.getItem("roomCode")

            this.socket.emit("leaveLobby", { token: token!, roomCode: roomCode! }, (result: boolean) => {

                return res(result) // Resolve True OR False.

            })
            
        })
    }

    // Attempt to create a new lobby on request.
    async createLobby(username: string): Promise<string> {
        return new Promise((res, rej) => {

            this.socket.emit("createLobby", { username: username }, (result: { username: string, token: string, roomCode: string }) => {

                if (result) {

                    localStorage.setItem("token", result.token)
                    localStorage.setItem("roomCode", result.roomCode)
                    localStorage.setItem("username", result.username) // This is the username the server corrected, if any corrections were made.

                    return res(result.roomCode); // Success

                } else {

                    return rej(false); // Error occured

                }

            })

        })
    }

    async validateToken(token: string, roomCode: string): Promise<validateTokenEnums> {
        return new Promise((res, rej) => {

            this.socket.emit("validateToken", { token: token, roomCode: roomCode }, (result: validateTokenEnums) => {

                return res(result);

            })

        })
    }

    async startGame(): Promise<false | startGamePayload> {

        return new Promise((res, rej) => {

            const token = localStorage.getItem("token")
            const roomCode = localStorage.getItem("roomCode")

            this.socket.emit("startGame", { token: token!, roomCode: roomCode! }, (result: false | startGamePayload) => {

                return res(result) // Resolve with false OR the payload of puzzles.

            })

        })

    }

    async sendAnswer(zoneName: string, puzzleType: puzzleTypes, answer: any): Promise<boolean> {

        return new Promise((res, rej) => {

            const token = localStorage.getItem("token")
            const roomCode = localStorage.getItem("roomCode")

            this.socket.emit("answerPuzzle", { token: token!, roomCode: roomCode!, zoneName: zoneName, puzzleType: puzzleType, answer: answer }, (result: boolean) => {

                return res(result) // Resolves with if the answer is right or wrong

            })

        })

    }

}