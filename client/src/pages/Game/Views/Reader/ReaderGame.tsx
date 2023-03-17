import React from 'react'
import { gameInfo, zoneNames } from '../../../../API/requests'
import ButtonCombinationManual from '../../../../Puzzles/ButtonCombination/Manual/ButtonCombinationManual'
import { AuthProp } from '../../../../utils/propTypes'
import ManualTarget from './ManualTarget/ManualTarget'
import styles from './ReaderGame.module.css'

export default function ReaderGame(props: { gameInfo: gameInfo, setGameInfo: React.Dispatch<gameInfo>, activePuzzle: { element: JSX.Element, zoneName: zoneNames | undefined }, setActivePuzzle: React.Dispatch<{ element: JSX.Element, zoneName: zoneNames | undefined }> } & AuthProp) {

    const answerPages = []
    for (const puzzle of props.gameInfo.puzzles) {
        // A solution is provided for this player
        if (puzzle.solution) {

            if (puzzle.type == "buttonCombination") {

                answerPages.push(<ButtonCombinationManual/>)

            }
            // Add more puzzles!
        }

    }

    return (
        <div className={styles.container}>

            <div>

            </div>

        </div>
    )

}