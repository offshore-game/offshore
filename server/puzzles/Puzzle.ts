import GameLobby, { zoneNames } from "../classes/GameLobby/GameLobby"

export type puzzleTypes = "numberCombination" | "buttonCombination" | "buttonSpeed" | "wireConnect" | "wireCut"
export const puzzleTypeArray = ["numberCombination", "buttonCombination", "buttonSpeed", /*"wireConnect", "wireCut"*/] as puzzleTypes[]

export default class Puzzle {
    
    lobby: GameLobby
    solution: any
    fragmentedSolutions: any[]
    zoneName: zoneNames
    type: puzzleTypes
    remainingTime: number
    expirationTimeout: NodeJS.Timeout
    decreaseInterval: NodeJS.Timeout

    constructor(lobby: GameLobby, zoneName: zoneNames, type: puzzleTypes, durationSec: number, spawnDelaySec: number) {

        this.lobby = lobby
        this.zoneName = zoneName
        this.type = type
        this.remainingTime = durationSec
        setTimeout(() => {


            // Decrease the remaining time every second
            this.decreaseInterval = setInterval(() => {

                this.remainingTime--

            }, 1000)
            

            this.expirationTimeout = setTimeout(() => {

                // Destroy the decrease interval timer
                clearInterval(this.decreaseInterval)
                
                // Tell the game lobby that the puzzle expired
                lobby.events.emitter.emit(lobby.events.names.expired, { puzzle: this })
    
            }, durationSec * 1000)


        }, spawnDelaySec * 1000)


    }

    addTimeBonus(seconds: number) {

        console.warn(`Adding time bonus to zone ${this.zoneName} of ${seconds}`)

        // Destroy the old timeout
        clearTimeout(this.expirationTimeout)

        this.remainingTime += seconds // Add the time to the remainingTime

        // Make a new timeout
        this.expirationTimeout = setTimeout(() => {

            // Destroy the decrease interval timer
            clearInterval(this.decreaseInterval)

            // Tell the game lobby that the puzzle expired
            this.lobby.events.emitter.emit(this.lobby.events.names.expired, { puzzle: this })

        }, this.remainingTime * 1000 /* New Time! */)

    }

    makeSolutions(solutionCount: number) {

        // Should return an array of different linked answer keys

    }

    validate(answer: any) {

        // Placeholder function for validating answers
        return true;

    }



}