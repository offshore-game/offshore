import React from 'react'
import styles from './PuzzleTarget.module.css'
import gameStyles from '../Game.module.css'
import { gameInfo, zoneNames } from '../../../API/requests'
import NumberCombination from '../../../Puzzles/NumberCombination/NumberCombination'
import { AuthProp } from '../../../utils/propTypes'

export default function PuzzleTarget(props: { active: boolean, zoneName: zoneNames, gameInfo: gameInfo, setActivePuzzle: React.Dispatch<{ element: JSX.Element, zoneName: zoneNames }> } & AuthProp) {

    return (
        <div className={styles.testButton} style={{backgroundColor: props.active ? "skyblue" : "gray"}} onClick={() => {

            // Animate the "activePuzzle" div in
            const activePuzzleContainer = document.getElementById('activePuzzleContainer')
            const shadow = document.getElementById('shadow')

            if (activePuzzleContainer && shadow) {

                // FEATURE: differentiate between different types of puzzles

                props.setActivePuzzle({ 
                    element: <NumberCombination count={props.gameInfo.puzzles.find(puzzle => puzzle.zoneName == props.zoneName)?.numberCount!} zoneName={props.zoneName} requests={props.requests}/>,
                    zoneName: props.zoneName 
                })

                activePuzzleContainer.className = gameStyles.activePuzzle
                shadow.style.zIndex = "999"

            }

        }}>Click me to see the puzzle at zone {props.zoneName}</div>
    )

}