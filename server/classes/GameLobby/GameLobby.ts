import { EventEmitter } from 'events';
import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import makeLobbyId from '../../generators/LobbyId';
import randomNumber from '../../generators/randomNumber';
import ButtonCombination from '../../puzzles/ButtonCombination';
import ButtonSpeed from '../../puzzles/ButtonSpeed';
import NumberCombination from '../../puzzles/NumberCombination';
import Puzzle, { puzzleTypeArray, puzzleTypes } from '../../puzzles/Puzzle';
import Player from '../Player';

export type zoneNames = "frontMast" | "backMast" | "controlRoom" | "engineRoom" | "captainDeck" | "secondaryDeck" | "crewmateDeck" | "emergencyDeck" | "operationCenter" | "entertainmentRoom"

type Puzzles = Puzzle & NumberCombination | ButtonCombination | ButtonSpeed

type puzzleArrayPayload = {
    zoneName: zoneNames,
    type: puzzleTypes,
    remainingTime: number,
    numberCount?: number,
    solution?: any, // idk what type solution would be
}[]



export default class GameLobby {

    id: string
    events: { emitter: EventEmitter, names: { complete: string, expired: string, incorrect: string } }
    state: "LOBBY" | "INGAME" | "CUTSCENE"
    players: Player[]
    puzzles: { active: Puzzles[], awaiting: Puzzles[], solved: Puzzles[] }
    durationSec: number
    healthPoints: number
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>

    gameLifecycleLoop: ReturnType<typeof setInterval>

    percentKeepActive: number


    constructor(io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, lobbyIDs: string[]) {
        this.id = makeLobbyId(4, lobbyIDs) // Create a random 4 letter ID for the lobby.
        this.events = {
            emitter: new EventEmitter(),
            names: { complete: "puzzleComplete", expired: "puzzleExpired", incorrect: "puzzleIncorrect" }
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
        this.percentKeepActive = 0.3 // 30%

    }


    zones = ["frontMast", "backMast", "controlRoom", "engineRoom", "captainDeck", "secondaryDeck", "crewmateDeck", "emergencyDeck", "operationCenter", "entertainmentRoom"] as zoneNames[]

    emitToAllPlayers(eventName: string, individualPlayerContents: { socketId: string, payload: any }[]) {

        for (const playerContent of individualPlayerContents) {

            const socket = this.players.find(player => player.socketId == playerContent.socketId).socket
            socket.emit(eventName, playerContent.payload)

        }

    }

    changeHealth(subtractAmount: number) {

        // Will subtract this amount from the health counter
        this.healthPoints = this.healthPoints - subtractAmount

        this.io.in(this.id).emit("healthChange", { health: this.healthPoints })

        console.log(`${this.id} || new health:`, this.healthPoints)

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
        let unusedPuzzles: puzzleTypes[] = [...puzzleTypeArray]
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
        let unusedZones: zoneNames[] = [...this.zones]
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
        //const randomlySelectedPuzzleType = "buttonSpeed" as any // for testing

        // Select a random zone
        const randomlySelectedZone = unusedZones[randomNumber(0, unusedZones.length - 1 /*0-based index fix */)]
            if (!randomlySelectedZone) return null; // terminate the generation: bug prevention

        let generatedPuzzle: Puzzles

        // Calculate how many fragments would be needed
        const readerCount = this.players.filter(player => player.role == "READER").length

        /*
            Sample arrow function:
            const myFunc = () => {
            }
        */
            const dbCount = () => {
                if (this.durationSec > 240){return 4;}
                else if (this.durationSec > 180){return 5;}
                else if (this.durationSec > 120){return 6;}
                else if (this.durationSec > 60){return 7;}
                else {return 8;}
            }
            const pCount = () => {
                if (this.durationSec > 240){return 2;}
                else if (this.durationSec > 180){return 3;}
                else if (this.durationSec > 120){return 4;}
                else if (this.durationSec > 60){return 5;}
                else {return 6;}
            }
            
            /**
            * Cannot be more fragments than readers (use readerCount)
            * Max number of readers is 5
            * 300 seconds / 60 seconds per level = 5 
            * 3 fragments max (increase from level 1 to 3), but most be <= number of readers
            */
            const fCount = () => {
                if (this.durationSec > 240){return 1;}
                else if (this.durationSec > 180){
                    if (readerCount >= 2) {return 2;}
                    else {return readerCount;}
                }
                else {
                    if (readerCount >= 3) {return 3;}
                    else {return readerCount;}
                }
            }

        // Make the puzzle using the random type
        if (randomlySelectedPuzzleType == "numberCombination") {

            // FEATURE: Digit Count and Duration are Arbitrary for now
            generatedPuzzle = new NumberCombination(this, randomlySelectedZone, dbCount(), 90, addTimeout ? 2 : 0, fCount())
            // Change: digitCount, fragmentCount

        } else if (randomlySelectedPuzzleType == "buttonCombination") {

            // FEATURE: Button Count and Duration are Arbitrary for now
            generatedPuzzle = new ButtonCombination(this, randomlySelectedZone, dbCount(), 90, addTimeout ? 2 : 0, fCount())
            // Change: digitCount, fragmentCount

        } else if (randomlySelectedPuzzleType == "buttonSpeed") {

            // FEATURE: Button Count and Duration are Arbitrary for now
            generatedPuzzle = new ButtonSpeed(this, randomlySelectedZone, { rows: 4, columns: 4 }, Math.floor(1.2*dbCount()), pCount(), 90, addTimeout ? 2 : 0, fCount())
            // Change: digitCount, fragmentCount, poisonCount, standardCount (balancing issue?), rows/columns

        } else {

            // FEATURE: add more puzzle types!
            generatedPuzzle = new ButtonCombination(this, randomlySelectedZone, dbCount(), 90, addTimeout ? 2 : 0, fCount())

        }

        // Delay activating the puzzle
        if (addTimeout) {

            // Add the puzzle to the awaiting array
            this.puzzles.awaiting.push(generatedPuzzle)

            setTimeout(() => {

                const puzzleIndex = this.puzzles.awaiting.findIndex((puzzle) => puzzle.zoneName == randomlySelectedZone) // This is really the only unique identifier at a given time

                // Destroyed for whatever reason
                if (puzzleIndex == -1) return;

                // Remove from the "awaiting" array
                this.puzzles.awaiting.splice(puzzleIndex, 1)

                // Add to the "active" array
                this.puzzles.active.push(generatedPuzzle)

                // Tell the clients a new puzzle was made
                this.emitToAllPlayers("puzzleChange", this.prepareGamePayloads())

                return;

            }, 2000 /* 2S to MS */)

        } else {

            // Add to the "active" array
            this.puzzles.active.push(generatedPuzzle)

            // Tell the clients a new puzzle was made
            this.emitToAllPlayers("puzzleChange", this.prepareGamePayloads())

            return generatedPuzzle;

        }

    }

    prepareGamePayloads(): { socketId: string, payload: { lengthSec: number, readerList: string[], puzzles: puzzleArrayPayload } }[] {
        
        let payloads = []
        for (const player of this.players) {

            const puzzleInfo = []
            for (const puzzle of this.puzzles.active) {
    
                let toPush = {
                    zoneName: puzzle.zoneName,
                    type: puzzle.type,
                    remainingTime: puzzle.remainingTime,
                    numberCount: undefined,
                    buttonCount: undefined,
                    buttonGridDimensions: undefined,
                    buttonGridTimings: undefined,
                    solution: undefined,
                    numberOfFragments: undefined,
                }

                // Include a fragment of the solution if the player is a READER
                if (player.role == "READER") {

                    let selectedFragment
                    
                    // Find if the player already has an assigned fragment for this puzzle
                    const findAlreadyAssigned = puzzle.fragmentedSolutions.filter(fragment => fragment.assignedSocket == player.socketId)[0]

                    // Find a fragment that is not already assigned
                    const findUnusedFragment = puzzle.fragmentedSolutions.filter(fragment => fragment.assignedSocket == undefined)[0]
                    if (findAlreadyAssigned) {

                        selectedFragment = findAlreadyAssigned

                    } else if (findUnusedFragment) {
                        
                        // Assign the fragment to this player
                        findUnusedFragment.assignedSocket = player.socketId

                        selectedFragment = findUnusedFragment
                    } else {

                        // Select a random fragment to show if there are none left over
                        selectedFragment = puzzle.fragmentedSolutions[randomNumber(0, puzzle.fragmentedSolutions.length - 1)]

                    }

                    toPush.solution = selectedFragment

                    if (puzzle.type == "buttonSpeed" && player.role == "READER"){
                        const numberOfFragments = puzzle.fragmentedSolutions.length
                        toPush.numberOfFragments = numberOfFragments
                    }

                }

                // Puzzle-specific additions
                if (puzzle.type == "numberCombination") {
                    toPush.numberCount = (puzzle as NumberCombination).digitCount
                } else if (puzzle.type == "buttonCombination") {
                    toPush.buttonCount = (puzzle as ButtonCombination).buttonCount
                } else if (puzzle.type == "buttonSpeed") {

                    const buttonSpeedPuzzle = puzzle as ButtonSpeed

                    // Add dimensional information
                    toPush.buttonGridDimensions = buttonSpeedPuzzle.dimensions

                    // Add timings info
                    toPush.buttonGridTimings = {

                        standard: buttonSpeedPuzzle.timings,
                        poison: buttonSpeedPuzzle.poisonTimings,
                        duration: buttonSpeedPuzzle.gameDuration,
                        timeToHit: buttonSpeedPuzzle.timeToHit,

                    }

                }

                // Push to array
                puzzleInfo.push(toPush)
    
            }

            const readerList = []
            for (const player of this.players.filter(player => player.role == "READER")) {
                readerList.push(player.username)
            }

            payloads.push({
                socketId: player.socketId,
                payload: {
                    lengthSec: 300,
                    readerList: readerList,
                    puzzles: puzzleInfo,
                },
            })

        }

        return payloads

    }

    managePercentActive(): number {

        /*
        1) Check player count
        2) Check time
        */

        // Decide a multiplier based on player count (max 10)
        const playerCount = this.players.length
        const multiplier = Math.ceil(playerCount / 2) // dependent upon the number of solvers (bigger half of active players)

        const getSafePercent = (percentActive: number) => {

            const result = percentActive * multiplier
            if (result > 1) {

                return 1;

            } if (result < 0.3) {
                
                return 0.3;
                
            } else {

                return result;

            }

        }

        if (this.durationSec > 240){
            return this.percentKeepActive = getSafePercent(0.3)
        } else if (this.durationSec > 180) {
            return this.percentKeepActive = getSafePercent(0.4)
        } else if (this.durationSec > 120) {
            return this.percentKeepActive = getSafePercent(0.5)
        } else if (this.durationSec > 60) {
            return this.percentKeepActive = getSafePercent(0.6)
        } else {
            return this.percentKeepActive = getSafePercent(0.7)
        }

    }

    async addPlayer(username: string, socket: Socket, isOwner?: boolean): Promise<Player> {
        return new Promise(async (res, rej) => {

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
                if (finalUsername.length == 0) return rej("INVALIDNAME");

                // Reject duplicate names
                let pass = true
                for (const player of this.players) {
                    if (player.username == finalUsername) { pass = false; return rej("DUPLICATENAME"); }
                }
                    if (!pass) return false;
            
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

    cutscene(type: "START" | "END") {

        this.state = "CUTSCENE"

        if (type == "START") {

            setTimeout(() => {

                this.startGame()

            }, 5000 /* FEATURE: Start Cutscene Time */)

        }

    }

    async startGame(): Promise<false | { lengthSec: number, puzzles: puzzleArrayPayload }> {

        // Run the Cutscene
        this.state = "CUTSCENE"

        /*
            We need to generate puzzles, but prevent them from overlapping
            in different boat zones until they expire.

            SOLUTION ONE:
            Keep count of the number of active puzzles and their zones. Keep
            a percentage of zones active with a puzzle. When a puzzle is completed
            in a zone, add a delay and generate a new puzzle to be added there.

            ***Add a safeguard to prevent puzzles from overlapping in a zone.
        */


        // A puzzle has been completed successfully
        this.events.emitter.on(this.events.names.complete, (payload: { puzzle: Puzzles, socket: Socket }) => {

            // Handle the puzzle completion
            const completedIndex = this.puzzles.active.findIndex(value => payload.puzzle.zoneName == value.zoneName)
            if (completedIndex != -1) { // If it exists

                const puzzle = this.puzzles.active[completedIndex]
                clearTimeout(puzzle.expirationTimeout)
                
                this.puzzles.solved.push(puzzle) // Saved as a solved puzzle
                this.puzzles.active.splice(completedIndex, 1) // Delete from the active puzzle array

                // Add a time bonus to all puzzles
                for (const puzzle of this.puzzles.active) {

                    // Add ten seconds
                    puzzle.addTimeBonus(10)

                }

                // Tell the clients the puzzles changed
                this.emitToAllPlayers("puzzleChange", this.prepareGamePayloads())

                // Give 10 points to the player who answered correctly
                this.players.find(player => player.socketId == payload.socket.id).changePoints(10)

            }
            
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

            // Tell the clients the puzzles changed
            this.emitToAllPlayers("puzzleChange", this.prepareGamePayloads())


        })

        // A puzzle was solved incorrectly
        this.events.emitter.on(this.events.names.incorrect, (payload: { puzzle: Puzzles, socket: Socket }) => {

            // Deduct health points
            this.changeHealth(10)

            // Deduct 10 points from the player who answered correctly
            this.players.find(player => player.socketId == payload.socket.id).changePoints(-10)

        })

        // Keep the game tick lifecycle running
        this.gameLifecycleLoop = setInterval(() => {
            
            if (this.state == "INGAME") {

                // -1 Second from the game time
                this.durationSec--

                // Update the active percentage every tick
                this.percentKeepActive = this.managePercentActive()

                // Check if the health is 0
                if (this.healthPoints <= 0) {

                    // Go to an endgame cutscene
                    this.state = "CUTSCENE"

                    this.gameOver(false)
                    
                }

                if (this.durationSec <= 0) {

                    // Go to and endgame cutscene
                    this.state = "CUTSCENE"

                    this.gameOver(true)

                }

                const totalZoneCount = this.zones.length

                // Check how many puzzles are needed to be active
                const requiredActive = Math.floor(totalZoneCount * this.percentKeepActive)
    
                // Check if more puzzles are needed
                if ([...this.puzzles.active, ...this.puzzles.awaiting].length < requiredActive) {

                    console.debug(`${this.puzzles.active.length} puzzles active; ${requiredActive} needed`)
                    
                    const differential = requiredActive - this.puzzles.active.length
    
                    for (let i = 0; i < differential; i++) {

                        // Generate another puzzle (with a timeout)
                        this.generatePuzzle(true)
        
                    }

                }
    
            }

        }, 1000 /* 1 second */)
    

        return new Promise((res, rej) => {

            // Set the game time
            this.durationSec = 300 // 300 Seconds = 5 Minutes

            // Set the state after 5 seconds
            setTimeout(() => { console.log("game started"); this.state = "INGAME" }, 5000)

            const ruleset = this.prepareGamePayloads()[0].payload // less content; im also lazy to just do this properly so this works :p

            // Resolve with the ruleset payload
            return res(ruleset);

        })

    }

    async gameOver(success: boolean) {

        if (success) {

            const leaderboard: { username: string, coins: number }[] = []
            for (const player of this.players){

                leaderboard.push({
                    username: player.username,
                    coins: player.points,
                })

            }

            this.io.in(this.id).emit("gameOver", { success: true, leaderboard: leaderboard })

        } else {

            this.io.in(this.id).emit("gameOver", { success: false })

        }

    }

}
