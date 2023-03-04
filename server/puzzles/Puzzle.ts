import GameLobby, { zoneNames } from "../classes/GameLobby/GameLobby"

export type puzzleTypes = "numberCombination" | "buttonCombination" | "buttonSpeed" | "wireConnect" | "wireCut"
export const puzzleTypeArray = ["numberCombination", "buttonCombination", "buttonSpeed", "wireConnect", "wireCut"] as puzzleTypes[]

export default class Puzzle {
    
    solution: any
    fragmentedSolution: any[]
    zoneName: zoneNames
    type: puzzleTypes
    expirationTimeout: NodeJS.Timeout

    constructor(lobby: GameLobby, zoneName: zoneNames, type: puzzleTypes, durationSec: number) {

        this.zoneName = zoneName
        this.type = type
        this.expirationTimeout = setTimeout(() => {

            // Tell the game lobby that the puzzle expired
            lobby.events.emitter.emit(lobby.events.names.expired, { puzzle: this })

        }, durationSec * 1000)

    }

    makeSolutions(solutionCount: number) {

        // Should return an array of different linked answer keys

    }

    validate(answer: any) {

        // Placeholder function for validating answers
        return true;

    }



}