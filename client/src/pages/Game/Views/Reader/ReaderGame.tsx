import React from 'react'
import { gameInfo, zoneNames } from '../../../../API/requests'
import { AuthProp } from '../../../../utils/propTypes'
import ManualTarget from './ManualTarget/ManualTarget'
import styles from './ReaderGame.module.css'

export default function ReaderGame(props: { gameInfo: gameInfo, setGameInfo: React.Dispatch<gameInfo>, activePuzzle: { element: JSX.Element, zoneName: zoneNames | undefined }, setActivePuzzle: React.Dispatch<{ element: JSX.Element, zoneName: zoneNames | undefined }> } & AuthProp) {

    const puzzleAnswerSamples = []
    for (const puzzle of props.gameInfo.puzzles) {
        // A solution is provided for this player
        if (puzzle.solution) {
            puzzleAnswerSamples.push(<ManualTarget key={`${puzzle.zoneName}`} active={true} puzzle={puzzle} setActivePuzzle={props.setActivePuzzle} requests={props.requests}/>)
        }

    }

    return (
        <React.Fragment>

            { puzzleAnswerSamples }

            <div id="activePuzzleContainer" className={styles.hiddenPuzzle /* hiddenPuzzle, activePuzzle */}>

                <div id="puzzleAnswerOverlay" className={styles.inactiveAnswerOverlay /* inactiveAnswerOverlay, correctAnswerOverlay, incorrectAnswerOverlay */}/>

                <div className={styles.exitCube} onClick={() => {
                    // Animate the "activePuzzle" div out
                    const activePuzzleContainer = document.getElementById('activePuzzleContainer')
                    const shadow = document.getElementById('shadow')

                    if (activePuzzleContainer && shadow) {

                        props.setActivePuzzle({ element: <div/>, zoneName: undefined })
                        activePuzzleContainer.className = styles.hiddenPuzzle
                        shadow.style.zIndex = "-1"

                    }

                }}/>
                { props.activePuzzle.element }

            </div>

        </React.Fragment>
    )

}