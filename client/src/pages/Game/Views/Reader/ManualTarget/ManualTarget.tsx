import { useEffect, useState } from "react";
import { PuzzleInfo, zoneNames } from "../../../../../API/requests";
import NumberCombinationManual from "../../../../../Puzzles/NumberCombination/Manual/NumberCombinationManual";
import { AuthProp } from "../../../../../utils/propTypes";
import styles from './ManualTarget.module.css'
import gameStyles from '../../../Game.module.css'
import ButtonCombinationManual from "../../../../../Puzzles/ButtonCombination/Manual/ButtonCombinationManual";

export default function ManualTarget(props: { active: boolean, puzzle: PuzzleInfo, setActivePuzzle: React.Dispatch<{ element: JSX.Element, zoneName: zoneNames }> } & AuthProp) {

    const [ remainingTime, setRemainingTime ] = useState(0)
    const [ timerFunction, setTimerFunction ] = useState(undefined as any)

    // Expiry Timer
    useEffect(() => {

        setRemainingTime(props.puzzle.remainingTime)

        setTimerFunction(setInterval(() => {
            setRemainingTime(prevTime => prevTime - 1)
        }, 1000))

        return () => {

            console.log('clear interval')
            clearInterval(timerFunction)

        }

    }, [])


    return (
        <div className={styles.testButton} style={{backgroundColor: props.active ? "skyblue" : "gray"}} onClick={() => {

            // Animate the "activePuzzle" div in
            const activePuzzleContainer = document.getElementById('activePuzzleContainer')
            const shadow = document.getElementById('shadow')

            if (activePuzzleContainer && shadow) {

                // FEATURE: differentiate between different types of puzzles

                if (props.puzzle.type == "numberCombination") {

                    props.setActivePuzzle({ 
                        element: <NumberCombinationManual solution={props.puzzle.solution!.fragments}/>,
                        zoneName: props.puzzle.zoneName 
                    })

                } else if (props.puzzle.type == "buttonCombination") {

                    props.setActivePuzzle({ 
                        element: <ButtonCombinationManual solution={props.puzzle.solution!.fragments}/>,
                        zoneName: props.puzzle.zoneName 
                    })

                }

                activePuzzleContainer.className = gameStyles.activePuzzle
                shadow.style.zIndex = "999"

            }

        }}>
            Click me to see the puzzle at zone {props.puzzle.zoneName}
            Remaining Time: { remainingTime }
        </div>
    )

}