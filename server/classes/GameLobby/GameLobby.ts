import EventEmitter from 'events';
import { Socket } from 'socket.io';
import { playerType } from '../../types/lobbyTypes';

export default class GameLobby {

    id: string
    events: EventEmitter
    state: "LOBBY" | "INGAME" | "END"
    players: playerType[]


    constructor() {
        this.id = "AAAA" // FEATURE: create random ID
        this.events = new EventEmitter() 
        this.state = "LOBBY"
        this.players = []
    }




    async addPlayer(username: string, socket: Socket): Promise<playerType> {
        return new Promise(async (res, rej) => {

            // Duplicate name check first
            for (const player of this.players) {
                
                if (player.username == username) return rej(false);

            }

            const player = {

                token: "ABCD1234",
                username: username,
                role: "READER" as "READER" | "SOLVER",
                socketId: socket.id,
                socket: socket,
                connected: true,

            }

            // Add player to the websocket room
            await socket.join(this.id)

            // Add player to player list
            this.players.push(player)

            // Return the player object
            return res(player);

        })
    }


    async removePlayer(socketId: string) {
        return new Promise((res, rej) => {

            for (const [index, player] of this.players.entries()) {
                
                if (player.socketId == socketId) {

                    // Remove the player from the array, effectively destroying their token.
                    this.players.splice(index, 1)
                    return res(true);

                }
                
            }

            return rej(false); // If all fails.

        })

    }

}
