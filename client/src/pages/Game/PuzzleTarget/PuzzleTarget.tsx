import React from 'react'
import styles from './PuzzleTarget.module.css'
import gameStyles from '../Game.module.css'
import { startGamePayload, zoneNames } from '../../../API/requests'
import NumberCombination from '../../../Puzzles/NumberCombination/NumberCombination'
import { AuthProp } from '../../../utils/propTypes'

export default function PuzzleTarget(props: { active: boolean, zoneName: zoneNames, gameInfo: startGamePayload, setActivePuzzle: React.Dispatch<JSX.Element> } & AuthProp) {

    return (
        <div className={styles.testButton} style={{backgroundColor: props.active ? "skyblue" : "gray"}} onClick={() => {

            // Animate the "activePuzzle" div in
            const activePuzzleContainer = document.getElementById('activePuzzleContainer')
            const shadow = document.getElementById('shadow')

            if (activePuzzleContainer && shadow) {

                // FEATURE: differentiate between different types of puzzles

                props.setActivePuzzle(<NumberCombination count={4} zoneName={props.zoneName} requests={props.requests}/> )

                activePuzzleContainer.className = gameStyles.activePuzzle
                shadow.style.zIndex = "999"

            }

        }}>Click me to see the puzzle at zone {props.zoneName}</div>
    )

}