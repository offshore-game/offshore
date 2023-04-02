import { io, Socket } from "socket.io-client";
import { validateTokenEnums } from "./types/enums";
import homeStyles from '../pages/Home/Home.module.css'

export type zoneNames = "frontMast" | "backMast" | "controlRoom" | "engineRoom" | "captainDeck" | "secondaryDeck" | "crewmateDeck" | "emergencyDeck" | "operationCenter" | "entertainmentRoom"
type puzzleTypes = "numberCombination" | "buttonCombination" | "buttonSpeed" | "wireConnect" | "wireCut"

type timings = {
    // Button Index: Intervals (in seconds) to Light Up
    [key: number]: number[]
}

export type PuzzleInfo = {
    zoneName: zoneNames,
    type: puzzleTypes,
    remainingTime: number,
    numberCount?: number,
    buttonCount?: number,
    buttonGridDimensions?: { rows: number, columns: number },
    buttonGridTimings?: {
        standard: timings,
        poison: timings,
        duration: number,
        timeToHit: number,
    },
    solution?: {
        fragments: any[], // The fragmented solution provided only if the player has the READER role.
    },
    numberOfFragments?: number,
}

export type gameInfo = {
    lengthSec: number,
    puzzles: PuzzleInfo[],
    role?: "READER" | "SOLVER"
}

export default class Requests {

    socket: Socket

    constructor() {

        // this.socket = io("http://localhost:8080") // For local testing purposes only
        this.socket = io("https://api.offshoregame.app"); // Establish a connection

    }

    async displayError(errorMessage: string) {

        const sleep = async (ms: number) => {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        // Display the error to the user if an exception was thrown (home only)
        const errorContainer = document.getElementById("gameErrorContainer")!
        errorContainer.innerHTML = errorMessage


        errorContainer.className = homeStyles.errorContainer
        await sleep(2000)
        errorContainer.className = homeStyles.hiddenErrorContainer

    }

    // Attempt to reauthenticate into a lobby incase of a reload.
    async rejoinLobby() {
        return new Promise((res, rej) => {

            const token = sessionStorage.getItem("token")!
            const roomCode = sessionStorage.getItem("roomCode")

            this.socket.emit("rejoinLobby", { token: token, roomCode: roomCode }, (result: boolean) => {

                if (result) {

                    return res(true); // Success

                } else {

                    sessionStorage.setItem("token", "") // Wipe the old invalid token
                    sessionStorage.setItem("roomCode", "") // Wipe the old room code

                    return rej(false); // Error occured

                }

            })


        })
    }

    // Attempt to join a lobby on request.
    async joinLobby(username: string, roomCode: string): Promise<string[]> {
        return new Promise((res, rej) => {
            console.log('joning')
            this.socket.emit("joinLobby", { username: username, roomCode: roomCode }, async (data: { token: string, otherPlayers: string[]}) => {

                if (data.token) {

                    sessionStorage.setItem("token", data.token)
                    sessionStorage.setItem("roomCode", roomCode)
                    sessionStorage.setItem("username", username)
                    sessionStorage.setItem("isOwner", "false") // Make sure the client doesn't get confused
                    
                    return res(data.otherPlayers); // Success

                } else {

                    rej(false); // Error occured
                    if (data as any == "MAXPLAYERS") {
                        await this.displayError('The lobby is at the maximum amount of players.')
                    } else if (data as any == "INVALIDLOBBY") {
                        await this.displayError('This lobby does not exist!')
                    } else if (!data) {
                        await this.displayError('This username is already taken!')
                    } else if (data as any == "INVALIDNAME") {
                        await this.displayError('This username is not valid.')
                    } else if (data as any == "DUPLICATENAME") {
                        await this.displayError('This username is already taken!')
                    }
                    

                }

            })

        })
    }

    // Attempt to leave a lobby on request.
    async leaveLobby() {
        return new Promise((res, rej) => {
            
            const token = sessionStorage.getItem("token")
            const roomCode = sessionStorage.getItem("roomCode")

            this.socket.emit("leaveLobby", { token: token!, roomCode: roomCode! }, (result: boolean) => {

                return res(result) // Resolve True OR False.

            })
            
        })
    }

    // Attempt to create a new lobby on request.
    async createLobby(username: string): Promise<string> {
        return new Promise((res, rej) => {

            this.socket.emit("createLobby", { username: username }, async (result: { username: string, token: string, roomCode: string }) => {

                if (result) {

                    sessionStorage.setItem("token", result.token)
                    sessionStorage.setItem("roomCode", result.roomCode)
                    sessionStorage.setItem("username", result.username) // This is the username the server corrected, if any corrections were made.

                    return res(result.roomCode); // Success

                } else {

                    rej(false); // Error occured
                    await this.displayError('Please enter a valid username!')

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

    async startGame(): Promise<false | gameInfo> {

        return new Promise((res, rej) => {

            const token = sessionStorage.getItem("token")
            const roomCode = sessionStorage.getItem("roomCode")

            this.socket.emit("startGame", { token: token!, roomCode: roomCode! }, (result: false | gameInfo) => {

                if (!result) this.displayError("At least 2 players are needed to start the game!")
                return res(result) // Resolve with false OR the payload of puzzles.

            })

        })

    }

    async sendAnswer(zoneName: string, puzzleType: puzzleTypes, answer: any): Promise<boolean> {

        return new Promise((res, rej) => {

            const token = sessionStorage.getItem("token")
            const roomCode = sessionStorage.getItem("roomCode")

            this.socket.emit("answerPuzzle", { token: token!, roomCode: roomCode!, zoneName: zoneName, puzzleType: puzzleType, answer: answer }, (result: boolean) => {

                return res(result) // Resolves with if the answer is right or wrong

            })

        })

    }

}