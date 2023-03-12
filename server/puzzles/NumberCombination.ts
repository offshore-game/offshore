import Puzzle from "./Puzzle";
import randomNumber from "../generators/randomNumber";
import GameLobby, { zoneNames } from "../classes/GameLobby/GameLobby";

interface NumberCombinationAnswer {

    // Index of Counter : Answer (0 through 9)
    [key: number]: number

}

export default class NumberCombination extends Puzzle {

    solution: NumberCombinationAnswer
    fragmentedSolution: NumberCombinationAnswer[][]
    digitCount: number

    constructor(lobby: GameLobby, zoneName: zoneNames, digitCount: number, puzzleDurationSec: number, spawnDelaySec: number) {
        
        super(lobby, zoneName, "numberCombination", puzzleDurationSec, spawnDelaySec)

        this.digitCount = digitCount

        // Generate the solution
        const generatedSolution: NumberCombinationAnswer = {}

        for (let i = 0; i < digitCount; i++) {

            // The puzzle is between numbers 0 and 9
            generatedSolution[i] = randomNumber(0, 9)

        }

        // Save the generated solution as a whole
        this.solution = generatedSolution

        console.debug(`Solution for zone ${zoneName}`)
        console.debug(this.solution)

        this.fragmentedSolution = []

    }

    makeSolutions(solutionCount: number) {

        /*
            1) Randomly cut up the base solution
            2) Insert fragments into an array and return that
        */

        const solutionAsArray = [] as {digitIndex: string, digitValue: number}[]

        for (const key of Object.keys(this.solution)) {

            solutionAsArray.push({
                
                digitIndex: key,
                digitValue: this.solution[key]
                
            })

        }

        const centerIndex = Math.ceil(solutionAsArray.length / solutionCount)

        const fragments = [] as {digitIndex: string, digitValue: number}[][]

        // For each requested number of solutions...
        for (let i = 0; i < solutionCount; i++) {

            fragments.push(solutionAsArray.splice(-centerIndex))

        }

        this.fragmentedSolution = fragments

        console.log('fragmented solutions:', this.fragmentedSolution)

        return fragments;

    }

    validate(answer: NumberCombinationAnswer): boolean {

        console.debug('start validate')
        console.debug(this.solution)

        let pass = true
        for (const [key, value] of Object.entries(answer)) {

            if (value != this.solution[key]) {
                console.debug('incorrect solution at', key)
                pass = false
                return;

            }

        }

        console.debug("pass: ", pass)

        return pass;

    }

}
