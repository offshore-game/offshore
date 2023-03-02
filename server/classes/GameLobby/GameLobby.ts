import EventEmitter from 'events';
import { Socket } from 'socket.io';
import makeLobbyId from '../../generators/LobbyId';
import randomNumber from '../../generators/randomNumber';
import NumberCombination from '../../puzzles/NumberCombination';
import Puzzle, { puzzleTypeArray, puzzleTypes } from '../../puzzles/Puzzle';
import Player from '../Player';

export type zoneNames = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j"

export default class GameLobby {

    id: string
    events: EventEmitter
    state: "LOBBY" | "INGAME" | "END"
    players: Player[]
    puzzles: { active: (NumberCombination & Puzzle)[], awaiting: (NumberCombination & Puzzle)[], solved: (NumberCombination & Puzzle)[] }
    durationSec: number


    constructor() {
        this.id = makeLobbyId(4) // Create a random 4 letter ID for the lobby.
        this.events = new EventEmitter() 
        this.state = "LOBBY"
        this.players = []
        this.puzzles = {
            active: [],
            awaiting: [],
            solved: [],
        }
    }


    zones = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"] as zoneNames[]


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

    async startGame() {

        return new Promise((res, rej) => {

            // Set the game time
            this.durationSec = 300 // 300 Seconds = 5 Minutes

            // Generate Puzzles with their timestamps to send to clients
            /*
                We need to generate puzzles, but prevent them from overlapping
                in different boat zones until they expire.
            */

            /*
                SOLUTION ONE:
                Keep count of the number of active puzzles and their zones. Keep
                a percentage of zones active with a puzzle. When a puzzle is completed
                in a zone, add a delay and generate a new puzzle to be added there.

                ***Add a safeguard to prevent puzzles from overlapping in a zone.
            */


            const zoneCount = 10 // Assume ten different zones
            const percentageKeepActive = 0.6 // 60%

            


            /*
                PUZZLE GENERATION TECHNIQUE:
                Listen for when a puzzle is solved. When it is
                solved, check how many puzzles are needed to meet
                the percentageKeepActive requirement. 
                
                Then, look for what puzzle types are not used.
                (If there are none, select a general random one).
                
                Then, check for what zones are inactive and set a
                timeout to spawn the puzzle there.
                (As a safeguard, check if the zone is still free at the
                end of the timeout. If not, pick a different zone. If all
                required zones are full, destroy the puzzle). 
            */


            // FEATURE: Event needed -- onPuzzleSolve
            const onPuzzleSolve = () => {

                const activeCount = Math.floor(zoneCount * percentageKeepActive)

                // If there are enough puzzles, don't make more.
                if (activeCount >= zoneCount * percentageKeepActive) return;

                // Find what puzzle types aren't in use yet
                let unusedPuzzles: puzzleTypes[] = puzzleTypeArray
                for (const puzzle of [...this.puzzles.active, ...this.puzzles.awaiting]) { // For every puzzle active and about to be active...

                    // Find it's name in the unused array and delete it if it exists
                    const isInArray = unusedPuzzles.findIndex((value) => value == puzzle.type)

                    // Not Found
                    if (isInArray == -1) continue;
                    
                    // Delete from the array
                    unusedPuzzles.splice(isInArray, 1)
                    continue;

                }


                // Find what zones are free
                let unusedZones: zoneNames[] = this.zones
                for (const puzzle of [...this.puzzles.active, ...this.puzzles.awaiting]) { // For every puzzle active and about to be active...

                    const isInArray = unusedZones.findIndex((value) => value == puzzle.zoneName)

                    // Not Found
                    if (isInArray == -1) continue;
                    
                    // Delete from the array
                    unusedZones.splice(isInArray, 1)
                    continue;

                }

                // If all puzzles are in use, just pick a random one from the whole list
                if (unusedPuzzles.length == 0) unusedPuzzles = puzzleTypeArray


                // Select a random type of puzzle
                const randomlySelectedPuzzleType = unusedPuzzles[randomNumber(0, unusedPuzzles.length - 1 /* 0-based index fix */)]

                // Select a random zone
                const randomlySelectedZone = unusedZones[randomNumber(0, unusedZones.length - 1 /*0-based index fix */)]

                // Make the puzzle using the random type
                if (randomlySelectedPuzzleType == "numberCombination") {

                    // FEATURE: Digit Count is Arbitrary for now
                    const puzzle = new NumberCombination(randomlySelectedZone, 4)
                    this.puzzles.awaiting.push(puzzle)

                    setTimeout(() => {

                        const puzzleIndex = this.puzzles.awaiting.findIndex((puzzle) => puzzle.zoneName == randomlySelectedZone) // This is really the only unique identifier at a given time

                        // Destroyed for whatever reason
                        if (puzzleIndex == -1) return;

                        // FEATURE: Send to Client

                        // Remove from the "awaiting" array
                        this.puzzles.awaiting.splice(puzzleIndex, 1)

                        // Add to the "active" array
                        this.puzzles.active.push(puzzle)

                        return;

                    }, 2000 /* 2S to MS */)
                    
                }

            }

        })

    }

}
