import Puzzle from "./Puzzle";
import randomNumber from "../generators/randomNumber";
import GameLobby, { zoneNames } from "../classes/GameLobby/GameLobby";

interface NumberCombinationAnswer {

    // Index of Counter : Answer (0 through 9)
    [key: number]: number

}

export default class NumberCombination extends Puzzle {

    solution: NumberCombinationAnswer
    fragmentedSolutions: { assignedSocket: string | undefined, fragments: NumberCombinationAnswer[] }[]
    /*
    [
        {
            assignedSocket: undefined,
            fragments: [
                {
                    "0": 0
                }
            ]
        }
    ]
    */
    digitCount: number

    constructor(lobby: GameLobby, zoneName: zoneNames, digitCount: number, puzzleDurationSec: number, spawnDelaySec: number, fragmentCount: number) {
        
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

        this.fragmentedSolutions = this.makeSolutions(fragmentCount)

    }

    makeSolutions(solutionCount: number) {

        /*
            1) Randomly cut up the base solution
            2) Insert fragments into an array and return that
        */

        const fragmentedSolutions = []

        const individualEntrySolutions = [] as { digitIndex: string, digitValue: number }[]
        for (const key of Object.keys(this.solution)) {

            individualEntrySolutions.push({

                digitIndex: key,
                digitValue: this.solution[key]

            })

        }

        const centerIndex = Math.ceil(individualEntrySolutions.length / solutionCount)

        for (let i = 0; i < solutionCount; i++) {

            fragmentedSolutions.push({
                assignedSocket: undefined,
                fragments: individualEntrySolutions.splice(-centerIndex)
            })

        }

        this.fragmentedSolutions = fragmentedSolutions

        return fragmentedSolutions

    }

    validate(answer: NumberCombinationAnswer): boolean {

        let pass = true
        for (const [key, value] of Object.entries(answer)) {

            if (value != this.solution[key]) {
                
                pass = false
                return;

            }

        }

        return pass;

    }

}
