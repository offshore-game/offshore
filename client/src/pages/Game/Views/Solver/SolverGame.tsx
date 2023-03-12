import React, { useEffect, useState } from 'react'
import { gameInfo, zoneNames } from '../../../../API/requests';
import { AuthProp } from '../../../../utils/propTypes';
import styles from './SolverGame.module.css'
import PuzzleTarget from '../../PuzzleTarget/PuzzleTarget';


export default function SolverGame(props: { gameInfo: gameInfo, setGameInfo: React.Dispatch<gameInfo>, activePuzzle: { element: JSX.Element, zoneName: zoneNames | undefined }, setActivePuzzle: React.Dispatch<{ element: JSX.Element, zoneName: zoneNames | undefined }> } & AuthProp) {

    // Event Listeners for Solver Game Events \\
    useEffect(() => {

        const resultFunction = (event: any) => {

            const zoneName = event.detail.zoneName as zoneNames
            const correct = event.detail.result as boolean

            if (props.activePuzzle.zoneName == zoneName) {
                const overlay = document.getElementById('puzzleAnswerOverlay')
                    if (!overlay) return;

                // Answered Correctly
                if (correct) {
                    overlay.className = styles.correctAnswerOverlay
                }

                // Answered Incorrectly
                if (!correct) {
                    overlay.className = styles.incorrectAnswerOverlay
                }

                setTimeout(() => { overlay.className = styles.inactiveAnswerOverlay }, 1000)

            }

        }
        document.addEventListener("puzzleResult", resultFunction)


        return () => {

            // Destroy event listeners
            document.removeEventListener("puzzleResult", resultFunction)

        }

    })
    
    // TESTING \\
    const puzzleTargetSamples = []
    for (const puzzle of props.gameInfo.puzzles) {
        //console.log(`time of puzzle at ${puzzle.zoneName}: ${puzzle.remainingTime}`)
        puzzleTargetSamples.push(<PuzzleTarget active={true} puzzle={puzzle} setActivePuzzle={props.setActivePuzzle} requests={props.requests}/>)

    }

    // Solver Game Panel \\
    return (
        <React.Fragment>
        
            { puzzleTargetSamples }

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
