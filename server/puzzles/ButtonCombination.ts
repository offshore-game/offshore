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

        // Generate the solution
        const generatedSolution: ButtonCombinationAnswer = {}

        for (let i = 0; i < buttonCount; i++) {

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
