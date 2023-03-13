import React, { useEffect, useState } from 'react'
import styles from './PuzzleTarget.module.css'
import gameStyles from '../../../Game.module.css'
import { PuzzleInfo, zoneNames } from '../../../../../API/requests'
import NumberCombination from '../../../../../Puzzles/NumberCombination/Puzzle/NumberCombinationPuzzle'
import { AuthProp } from '../../../../../utils/propTypes'

export default function PuzzleTarget(props: { active: boolean, puzzle: PuzzleInfo, setActivePuzzle: React.Dispatch<{ element: JSX.Element, zoneName: zoneNames }> } & AuthProp) {

    const [ remainingTime, setRemainingTime ] = useState(props.puzzle.remainingTime) // This default value is broken, for some reason... it likes to synchronize when the component is re-made
    const [ timerFunction, setTimerFunction ] = useState(undefined as any)

    // Expiry Timer
    useEffect(() => { // the bug is in here... not the server and not the parent passing wrong information // there is a major desynchronization issue here

        setTimerFunction(setInterval(() => {
            setRemainingTime(prevTime => prevTime - 1)
        }, 1000))

        return () => {

            console.log(`clear interval for ${props.puzzle.zoneName}`)
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
                        element: <NumberCombination count={props.puzzle.numberCount!} zoneName={props.puzzle.zoneName} requests={props.requests}/>,
                        zoneName: props.puzzle.zoneName 
                    })

                } else if (props.puzzle.type == "buttonCombination") {

                    // etc...

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