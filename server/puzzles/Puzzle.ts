import { zoneNames } from "../classes/GameLobby/GameLobby"

export type puzzleTypes = "numberCombination" | "buttonCombination" | "buttonSpeed" | "wireConnect" | "wireCut"
export const puzzleTypeArray = ["numberCombination", "buttonCombination", "buttonSpeed", "wireConnect", "wireCut"] as puzzleTypes[]

export default class Puzzle {
    
    solution: any
    fragmentedSolution: any[]
    zoneName: zoneNames
    type: puzzleTypes

    constructor(zoneName: zoneNames, type: puzzleTypes) {

        this.zoneName = zoneName
        this.type = type

    }

    makeSolution(solutionCount: number) {

        // Should return an array of different linked answer keys

    }

    validate(answer: any) {

        // Placeholder function for validating answers

    }



}