import { EventEmitter } from 'events';
import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import makeLobbyId from '../../generators/LobbyId';
import randomNumber from '../../generators/randomNumber';
import NumberCombination from '../../puzzles/NumberCombination';
import Puzzle, { puzzleTypeArray, puzzleTypes } from '../../puzzles/Puzzle';
import Player from '../Player';

export type zoneNames = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j"

type Puzzles = NumberCombination & Puzzle

export default class GameLobby {

    id: string
    events: { emitter: EventEmitter, names: { complete: string, expired: string } }
    state: "LOBBY" | "INGAME" | "END"
    players: Player[]
    puzzles: { active: Puzzles[], awaiting: Puzzles[], solved: Puzzles[] }
    durationSec: number
    healthPoints: number
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>

    percentKeepActive: number


    constructor(io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
        this.id = makeLobbyId(4) // Create a random 4 letter ID for the lobby.
        this.events = {
            emitter: new EventEmitter(),
            names: {complete: "puzzleComplete", expired: "puzzleExpired"}
        }
        this.state = "LOBBY"
        this.players = []
        this.puzzles = {
            active: [],
            awaiting: [],
            solved: [],
        }

        // Set the io to make requests from within the lobby
        this.io = io

        this.healthPoints = 100
        this.durationSec = 300
        this.percentKeepActive = 0.6 // 60%

    }


    zones = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"] as zoneNames[]

    changeHealth(subtractAmount: number) {

        // Will subtract this amount from the health counter
        this.healthPoints = this.healthPoints - subtractAmount

        this.io.in(this.id).emit("healthChange", { health: this.healthPoints })

        // Check if the server's health has dropped to zero or (bugged) below that
        if (this.healthPoints <= 0) {

            // Tell all clients game's over, by loss
            this.io.in(this.id).emit("gameOver")

        }

    }

    generatePuzzle(addTimeout?: boolean): void | Puzzles {

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

        let generatedPuzzle: Puzzles

        // Make the puzzle using the random type
        if (randomlySelectedPuzzleType == "numberCombination") {

            // FEATURE: Digit Count and Duration are Arbitrary for now
            generatedPuzzle = new NumberCombination(this, randomlySelectedZone, 4, 60)

        } else {

            // FEATURE: add more puzzle types!
            generatedPuzzle = new NumberCombination(this, randomlySelectedZone, 4, 60)

        }

        // Delay activating the puzzle
        if (addTimeout) {

            // Add the puzzle to the awaiting array
            this.puzzles.awaiting.push(generatedPuzzle)

            setTimeout(() => {

                const puzzleIndex = this.puzzles.awaiting.findIndex((puzzle) => puzzle.zoneName == randomlySelectedZone) // This is really the only unique identifier at a given time

                // Destroyed for whatever reason
                if (puzzleIndex == -1) return;

                                                                                                                        // FEATURE: Send to Client

                // Remove from the "awaiting" array
                this.puzzles.awaiting.splice(puzzleIndex, 1)

                // Add to the "active" array
                this.puzzles.active.push(generatedPuzzle)

                return;

            }, 2000 /* 2S to MS */)

        } else {

            // Add to the "active" array
            this.puzzles.active.push(generatedPuzzle)

            return generatedPuzzle;

        }

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

    async startGame(): Promise<false | { lengthSec: number, puzzles: { zoneName: zoneNames, puzzles: puzzleTypes[] }[] }> {

        /*
            FEATURE: A timeout is needed for each "stage" the lobby
            can go through within the five minutes.
        */

        /*
            We need to generate puzzles, but prevent them from overlapping
            in different boat zones until they expire.

            SOLUTION ONE:
            Keep count of the number of active puzzles and their zones. Keep
            a percentage of zones active with a puzzle. When a puzzle is completed
            in a zone, add a delay and generate a new puzzle to be added there.

            ***Add a safeguard to prevent puzzles from overlapping in a zone.
        */

        const zoneCount = this.zones.length

        // A puzzle has been completed successfully
        this.events.emitter.on(this.events.names.complete, (payload: { puzzle: Puzzles }) => {

            // Handle the puzzle completion
            const completedIndex = this.puzzles.active.findIndex(value => payload.puzzle.zoneName == value.zoneName)
            if (completedIndex != -1) { // If it exists

                const puzzle = this.puzzles.active[completedIndex]
                clearTimeout(puzzle.expirationTimeout)
                
                this.puzzles.solved.push(puzzle) // Saved as a solved puzzle
                this.puzzles.active.splice(completedIndex, 1) // Delete from the active puzzle array

                

            }
            
            // Check if we need another puzzle
            const activeCount = Math.floor(zoneCount * this.percentKeepActive)
            // If there are enough puzzles, don't make more.
            if (activeCount >= zoneCount * this.percentKeepActive) return;

            // Generate another puzzle (with a timeout)
            this.generatePuzzle(true)
            
        })

        // A puzzle has expired
        this.events.emitter.on(this.events.names.expired, (payload: { puzzle: Puzzles }) => {
            
            /*
                1) Tell the game lobby to deduct health points (and tell clients the new health)
                2) Move the puzzle from active to "solved"
            */

            // 25 Point deduction for the puzzle expiring
            this.changeHealth(25) // This function handles sending to clients the new health

            // Find the right puzzle
            const puzzleIndex = this.puzzles.active.findIndex((puzzle) => puzzle.zoneName == payload.puzzle.zoneName)
            if (puzzleIndex == -1) return; // Doesn't exist

            const puzzle = this.puzzles.active[puzzleIndex]

            // Remove from the "active" array
            this.puzzles.active.splice(puzzleIndex, 1)

            // Add to the "solved" array
            this.puzzles.solved.push(puzzle)

            // FEATURE: make new puzzle?

        })

        return new Promise((res, rej) => {

            console.log("game started")

            // Set the game time
            this.durationSec = 300 // 300 Seconds = 5 Minutes

            // Set the state
            this.state = "INGAME"

            /*
                First we need to generate the original list of puzzles for the lobby
            */

            const puzzleCount = Math.floor(this.zones.length * this.percentKeepActive)

            console.debug(`Need ${puzzleCount} puzzles`)

            const ruleset = {
                lengthSec: 300,
                puzzles: [],
            }

            // Continually generate puzzles to meet the required amount
            for (let i = 0; i <= puzzleCount; i++) {

                // Generate a puzzle (without a timeout)
                const generated = this.generatePuzzle(false)

                if (generated) {

                    ruleset.puzzles.push({
                        zoneName: generated.zoneName,
                        type: generated.type,
                    })

                }
 
            }

                        // TESTING
                        //this.puzzles.active.push(new NumberCombination(this, "a", 5, 100))


            // Resolve with the ruleset payload
            return res(ruleset);



  
        })

    }

}
