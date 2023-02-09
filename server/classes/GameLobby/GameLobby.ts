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
        this.id = makeLobbyId(4) // Create a random 4 letter ID for the lobby.
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

            // Clean up usernames with hanging spaces
            const usernameArray = username.split('');
            let tempArray = [] as string[]

            for (const [index, character] of usernameArray.entries()) {

                /* 
                
                A couple of cases to account for:

                " Name"
                "Name "
                " Name "

                */
                

                const previousEntry = usernameArray[index - 1]
                const nextEntry = usernameArray[index + 1]

                // Character IS a space
                if (character == " ") {
                    console.debug("character is a space")
                    if (!previousEntry || previousEntry == " ") {
                        
                        // // Character lacks a valid previous character; skip
                        continue;

                    }

                    if (!nextEntry || nextEntry == " ") {
                        
                        // Character lacks a valid next character; skip
                        continue;

                    }

                    // Both checks above are meant to see if there are actual characters around the space

                }
                // Add the character to the username array
                tempArray.push(character)

            }

            const finalUsername = tempArray.join('')
                // Reject blank usernames
                if (finalUsername.length == 0) rej(false);
            
            const player = new Player(finalUsername, socket, isOwner!)

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
