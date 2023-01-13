import EventEmitter from 'events';
import { Socket } from 'socket.io';
import makeLobbyId from '../../generators/LobbyId';
import Player from '../Player';

export default class GameLobby {

    id: string
    events: EventEmitter
    state: "LOBBY" | "INGAME" | "END"
    players: Player[]


    constructor() {
        this.id = makeLobbyId(4) // FEATURE: create random ID
        this.events = new EventEmitter() 
        this.state = "LOBBY"
        this.players = []
    }




    async addPlayer(username: string, socket: Socket, isOwner?: boolean): Promise<Player> {
        return new Promise(async (res, rej) => {

            // Duplicate name check first
            for (const player of this.players) {
                
                if (player.username == username) return rej(false);

            }

            const player = new Player(username, socket, isOwner!)

            // Add player to the websocket room
            await socket.join(this.id)

            // Add player to player list
            this.players.push(player)

            // Return the player object
            return res(player);

        })
    }


    async removePlayer(token: string): Promise<Player> {
        return new Promise((res, rej) => {

            for (const [index, player] of this.players.entries()) {
                
                if (player.token == token) {

                    // Remove the player from the array, effectively destroying their token.
                    this.players.splice(index, 1)
                    return res(player); // Returns the player that was removed

                }
                
            }

            return rej(false); // If all fails.

        })

    }

}
