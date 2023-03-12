import GameLobby, { zoneNames } from "../classes/GameLobby/GameLobby"

export type puzzleTypes = "numberCombination" | "buttonCombination" | "buttonSpeed" | "wireConnect" | "wireCut"
export const puzzleTypeArray = ["numberCombination", "buttonCombination", "buttonSpeed", "wireConnect", "wireCut"] as puzzleTypes[]

export default class Puzzle {
    
    solution: any
    fragmentedSolution: any[]
    zoneName: zoneNames
    type: puzzleTypes
    remainingTime: number
    expirationTimeout: NodeJS.Timeout

    constructor(lobby: GameLobby, zoneName: zoneNames, type: puzzleTypes, durationSec: number, spawnDelaySec: number) {

        this.zoneName = zoneName
        this.type = type
        this.remainingTime = durationSec
        this.expirationTimeout = setTimeout(() => {

            // Decrease the remaining time every second
            const interval = setInterval(() => {

                this.remainingTime--

            }, 1000)
                        

            setTimeout(() => {

                // Destroy the decrease interval timer
                clearInterval(interval)
                
                // Tell the game lobby that the puzzle expired
                lobby.events.emitter.emit(lobby.events.names.expired, { puzzle: this })
    
                console.warn("puzzle expired!")
    
            }, durationSec * 1000)


        }, spawnDelaySec * 1000)


    }

    makeSolutions(solutionCount: number) {

        // Should return an array of different linked answer keys

    }

    validate(answer: any) {

        // Placeholder function for validating answers
        return true;

    }



}