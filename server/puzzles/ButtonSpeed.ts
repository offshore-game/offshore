import Puzzle from "./Puzzle";
import randomNumber from "../generators/randomNumber";
import GameLobby, { zoneNames } from "../classes/GameLobby/GameLobby";

// An array of poison button indexes
type ButtonSpeedAnswer = number[]
export type buttonSpeedPayload = {
    layout: { rows: number, columns: number },

    timings: {
        // Button Index: Seconds to Light Up
        [ key: number ]: number[]
    },

    poisonTimings: {
        // Button Index: Seconds to Light Up
        [ key: number ]: number[]
    },

    // In seconds
    gameDuration: number,

    // In seconds
    timeToHit: number, // NOTE: At minimum there must be a 1 second buffer + timeToHit between buttons lighting up
}

export default class ButtonSpeed extends Puzzle {

    solution: ButtonSpeedAnswer
    fragmentedSolutions: { assignedSocket: string | undefined, fragments: ButtonSpeedAnswer[] }[]
    /*
    [
        {
            assignedSocket: undefined,
            fragments: [
                [1, 4, 6]
            ]
        }
    ]
    */
    dimensions: { rows: number, columns: number }
    timings: buttonSpeedPayload["timings"]
    poisonTimings: buttonSpeedPayload["poisonTimings"]
    buttonCount: number
    poisonCount: number
    gameDuration: number
    timeToHit: number

    constructor(lobby: GameLobby, zoneName: zoneNames, dimensions: { rows: number, columns: number }, buttonCount: number, poisonCount: number, puzzleDurationSec: number, spawnDelaySec: number, fragmentCount: number) {
        
        super(lobby, zoneName, "buttonCombination", puzzleDurationSec, spawnDelaySec)


        this.dimensions = dimensions

        this.timings = {}
        this.poisonTimings = {}

        this.buttonCount = buttonCount
        this.poisonCount = poisonCount

        this.gameDuration = 20 // 20 Seconds of Buttons
        this.timeToHit = 2 // 2 Seconds to hit a button

        const totalButtonCount = dimensions.rows * dimensions.columns

        // First, select the poison buttons
        const poisonIndexes: number[] = []
        for (let i = 0; i < this.poisonCount; i++) {

            function selectUniqueIndex() {

                let randomIndex = randomNumber(0, totalButtonCount - 1 /* 0-based index */)
                
                // Index is already chosen
                if (poisonIndexes.find(index => index == randomIndex)) {
    
                    // Recursive Function
                    randomIndex = selectUniqueIndex()
    
                }

                return randomIndex

            }

            poisonIndexes.push(selectUniqueIndex())
            
        }

        // Select Regular Indexes
        const buttonIndexes: number[] = []
        for (let i = 0; i < this.buttonCount; i++) {

            function selectUniqueIndex() {

                let randomIndex = randomNumber(0, totalButtonCount - 1 /* 0-based index */)
                
                // Index is already chosen
                if (buttonIndexes.find(index => index == randomIndex) || poisonIndexes.find(index => index == randomIndex)) {
    
                    // Recursive Function
                    randomIndex = selectUniqueIndex()
    
                }

                return randomIndex

            }

            buttonIndexes.push(selectUniqueIndex())

        }

        /*
            Timings Rules:
            1) Button cannot light up more than (x) number of times
            2) Buttons cannot have overlapping timings
            3) Timings on the same button must be at MINIMUM timeToHit + 1 apart
            4) For a given (second + timeToHit), only a certain number of concurrent buttons can be active
        */

        const allTimingsSeconds = (): number[] => {
            let allTimings = []
            for (const [index, timing] of Object.entries(this.timings)) {
                allTimings.push(timing)
            }
            for (const [index, timing] of Object.entries(this.poisonTimings)) {
                allTimings.push(timing)
            }

            return allTimings;
        }

        const lightCount = 3 // Buttons can light up a maximum of three times per game
        const concurrentCount = 4 // Only four buttons can light up at a time

        // Generate Timings for Poison Buttons
        for (const index of poisonIndexes) {

            let pass = true

            // Choose a timestamp
            const timestamp = randomNumber(0, this.gameDuration - (this.timeToHit + 1)) // The roof has to have a limit so the button is pressable within the time allotted

            // (1) Check how many times this button is to light up
            const allTimings = allTimingsSeconds()
            const thisTiming = allTimings.filter(timing => timing == timestamp)
            if (thisTiming.length + 1 > lightCount) {
                pass = false
            }


            // (2) Check for an overlapping timings on this button
            const duplicateTiming = this.poisonTimings[index].find(timing => timing == timestamp)
            if (duplicateTiming) {
                pass = false
            }

            // (3) Check for spacing (minimum timeToHit + 1 apart)
            for (const timing of this.poisonTimings[index]) {

                // Not enough distance between the timestamp and existing timings
                if (Math.abs(timestamp - timing) < this.timeToHit + 1) {
                    pass = false
                    return;
                }

            }

            // (4) Check how many concurrent buttons are active at that time
            if (thisTiming.length + 1 /* if we add another one */ > concurrentCount) {
                // Can't let this happen
                pass = false
            }

            // if pass == false, regenerate

        }


        // Generate Timings for Standard Buttons



        // Save the generated solution as a whole
        this.solution = poisonIndexes

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

    validate(answer: boolean): boolean {

        // Trust the front-end client to be truthful with this one
        return answer;

    }

}
