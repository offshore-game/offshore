import React, { useEffect, useState } from 'react'
import { gameInfo, zoneNames } from '../../../../API/requests';
import { AuthProp } from '../../../../utils/propTypes';
import gameStyles from '../../Game.module.css'
import styles from './SolverGame.module.css'
import pointPos from './Points.module.css'
import PuzzleTarget from './PuzzleTarget/PuzzleTarget';
import boat from '../../../../assets/Game/Boat.svg';


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
        // Bug Fix https://reactjs.org/docs/lists-and-keys.html
        // It's very possible this may be still bugged in rare circumstances, it would need to be tested.
        puzzleTargetSamples.push(<PuzzleTarget key={`${puzzle.zoneName}`} active={true} puzzle={puzzle} setActivePuzzle={props.setActivePuzzle} requests={props.requests}/>)
    }

    // Solver Game Panel \\
    return (
        <React.Fragment>
        
            { /*puzzleTargetSamples*/ }
            <div className={styles.boatContainer}>

                <img src={boat} style={{position: 'absolute'}}/>

                {/* All of the zone target points */}
                <div className={pointPos.frontMastPoint}/>
                <div className={pointPos.backMastPoint}/>
                <div className={pointPos.controlRoomPoint}/>
                <div className={pointPos.engineRoomPoint}/>
                <div className={pointPos.captainDeckPoint}/>
                <div className={pointPos.secondaryDeckPoint}/>
                <div className={pointPos.crewmateDeckPoint}/>
                <div className={pointPos.emergencyDeckPoint}/>
                <div className={pointPos.operationCenterPoint}/>
                <div className={pointPos.entertainmentRoomPoint}/>

            </div>


            <div id="activePuzzleContainer" className={gameStyles.hiddenPuzzle /* hiddenPuzzle, activePuzzle */}>

                <div id="puzzleAnswerOverlay" className={styles.inactiveAnswerOverlay /* inactiveAnswerOverlay, correctAnswerOverlay, incorrectAnswerOverlay */}/>

                <div className={styles.exitCube} onClick={() => {
                    // Animate the "activePuzzle" div out
                    const activePuzzleContainer = document.getElementById('activePuzzleContainer')
                    const shadow = document.getElementById('shadow')

                    if (activePuzzleContainer && shadow) {

                        props.setActivePuzzle({ element: <div/>, zoneName: undefined })
                        activePuzzleContainer.className = gameStyles.hiddenPuzzle
                        shadow.style.zIndex = "-1"

                    }

                }}/>
                { props.activePuzzle.element }
                

            </div>

        </React.Fragment>

    )
    
}
