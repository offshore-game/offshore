import Puzzle from "./Puzzle";
import randomNumber from "../generators/randomNumber";
import GameLobby, { zoneNames } from "../classes/GameLobby/GameLobby";

// An array in order of the index of the button pressed
interface ButtonCombinationAnswer {

    // The sequence the button was pressed in: the index of the button pressed
    [key: number]: number

}

export default class ButtonCombination extends Puzzle {

    solution: ButtonCombinationAnswer
    fragmentedSolutions: { assignedSocket: string | undefined, fragments: ButtonCombinationAnswer[] }[]
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
    buttonCount: number

    constructor(lobby: GameLobby, zoneName: zoneNames, buttonCount: number, puzzleDurationSec: number, spawnDelaySec: number, fragmentCount: number) {
        
        super(lobby, zoneName, "buttonCombination", puzzleDurationSec, spawnDelaySec)

        this.buttonCount = buttonCount

        // Start to generate the solution
        const generatedSolution: ButtonCombinationAnswer = {}

        // I don't want duplicate indexes
        const allowedIndexes = []
        for (let i = 0; i < buttonCount; i++) {

            allowedIndexes.push(i)

        }

        // Generate the actual solution
        for (let i = 0; i < buttonCount; i++) {

            // The puzzle is between how many buttons there are
            let randomIndex = randomNumber(0, allowedIndexes.length - 1 /* 0-based index */)
            generatedSolution[i] = allowedIndexes[randomIndex]

            // Remove from the allowedIndexes
            allowedIndexes.splice(randomIndex, 1)

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

        const individualEntrySolutions = [] as { buttonOrder: string, buttonIndex: number }[]
        for (const key of Object.keys(this.solution)) {

            individualEntrySolutions.push({

                buttonOrder: key,
                buttonIndex: this.solution[key]

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

    validate(answer: ButtonCombinationAnswer): boolean {

        // First check for identical length; prevent a bug where empty answers jump to true
        if (Object.entries(answer).length != Object.entries(this.solution).length) return false;

        // Assuming same length, loop through and make sure they are identical
        for (const [key, value] of Object.entries(answer)) {

            if (value != this.solution[key]) {

                return false;

            }

        }

        // Pass if nothing trips
        return true;

    }

}
