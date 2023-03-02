import Puzzle from "./Puzzle";
import randomNumber from "../generators/randomNumber";
import { zoneNames } from "../classes/GameLobby/GameLobby";

interface NumberCombinationAnswer {

    // Index of Counter : Answer (0 through 9)
    [key: number]: string

}

export default class NumberCombination extends Puzzle {

    solution: NumberCombinationAnswer
    fragmentedSolution: NumberCombinationAnswer[][]

    constructor(zoneName: zoneNames, digitCount: number) {
        
        super(zoneName, "numberCombination")

        // Generate the solution
        const solution = {}

        for (let i = 0; i < digitCount; i++) {

            // The puzzle is between numbers 0 and 9
            solution[i] = randomNumber(0, 9)

        }

        // Save the generated solution as a whole
        this.solution = solution

    }

    makeSolution(solutionCount: number) {

        /*
            1) Randomly cut up the base solution
            2) Insert fragments into an array and return that
        */

        const solutionAsArray = [] as {digitIndex: string, digitValue: string}[]

        for (const key of Object.keys(this.solution)) {

            solutionAsArray.push({
                
                digitIndex: key,
                digitValue: this.solution[key]
                
            })

        }

        const centerIndex = Math.ceil(solutionAsArray.length / solutionCount)

        const fragments = [] as {digitIndex: string, digitValue: string}[][]

        // For each requested number of solutions...
        for (let i = 0; i < solutionCount; i++) {

            fragments.push(solutionAsArray.splice(-centerIndex))

        }

        this.fragmentedSolution = fragments

        return fragments;

    }

}
