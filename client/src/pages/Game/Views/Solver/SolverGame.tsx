import React, { useEffect, useRef, useState } from 'react'
import { gameInfo, zoneNames } from '../../../../API/requests';
import { AuthProp } from '../../../../utils/propTypes';
import gameStyles from '../../Game.module.css'
import styles from './SolverGame.module.css'
import pointPos from './PointTarget/Points.module.css'
import boat from '../../../../assets/Game/Boat.svg';
import { ReactComponent as Water } from '../../../../assets/Game/Water.svg';
import { ReactComponent as Background } from '../../../../assets/Game/SolverBackground.svg';
import { ReactComponent as Clouds } from '../../../../assets/Game/Clouds Array.svg';
import PointTarget from './PointTarget/PointTarget';
import { ImCross } from 'react-icons/im';
import { GoTriangleDown, GoTriangleUp } from 'react-icons/go';
import toVisualZoneName from '../../../../utils/zoneNameConversion';

const sleep = async (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const randomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function SolverGame(props: { gameInfo: gameInfo, setGameInfo: React.Dispatch<gameInfo>, activePuzzle: { element: JSX.Element, zoneName: zoneNames | undefined }, setActivePuzzle: React.Dispatch<{ element: JSX.Element, zoneName: zoneNames | undefined }> } & AuthProp) {

    const [ sounds, setSounds ] = useState({} as { [key: string]: HTMLAudioElement })
    const [ visibleCapList, setVisibleCapList ] = useState(false)

    // Asset Pre-Loader \\
    useEffect(() => {

        // Success Sound
        setSounds(sounds => { return {
            ...sounds, "success": new Audio("/Sounds/success.mp3")
        }})

        // Click Sounds
        setSounds(sounds => { return {
            ...sounds,
            "mouseUp": new Audio("/Sounds/mouse up.mp3"),
            "mouseDown": new Audio("/Sounds/mouse down.mp3"),
        }})

        // FEATURE: Add more sounds

        // Passively Play Seagull Sounds
        const seagullSounds = {
            "seagull_1": new Audio("/Sounds/seagull 1.mp3"),
            "seagull_2": new Audio("/Sounds/seagull 2.mp3"),
            "seagull_3": new Audio("/Sounds/seagull 3.mp3"),
        }
        setSounds(sounds => { return { ...sounds, ...seagullSounds }})
        let kill = false
        let sound: any
        async function playSeagullSound() {

            const randomCooldown = randomNumber(4, 8)
            await sleep(randomCooldown * 1000)

            if (!kill) {

                const randomSound = randomNumber(1, 3)
                console.log(randomSound)
                sound = (seagullSounds as any)[`seagull_${randomSound}`] // Play the sound
                    sound.play()
                await sleep((sound.duration + 1) * 1000 )
                playSeagullSound()

            }

        }
        playSeagullSound()


        return () => {

            // Stop the seagull sounds
            kill = true
            if (sound) sound.pause()
            sound = undefined

        }

    }, [])


    // Event Listeners for Solver Game Events \\
    useEffect(() => {

        const resultFunction = async (event: any) => {

            const zoneName = event.detail.zoneName as zoneNames
            const correct = event.detail.result as boolean

            if (props.activePuzzle.zoneName == zoneName) {
                const overlay = document.getElementById('puzzleAnswerOverlay')
                    if (!overlay) return;

                // Answered Correctly
                if (correct) {
                    // Play a little sound effect
                    await sounds["success"].play()

                    overlay.className = styles.correctAnswerOverlay
                }

                // Answered Incorrectly
                if (!correct) {
                    // Sound effect is played when the healthbar changes instead
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
    const puzzleTargets = []
    for (const puzzle of props.gameInfo.puzzles) {
        // Bug Fix https://reactjs.org/docs/lists-and-keys.html
        // It's very possible this may be still bugged in rare circumstances, it would need to be tested.
        puzzleTargets.push(<PointTarget key={`${puzzle.zoneName}`} className={`${puzzle.zoneName}Point`} puzzle={puzzle} setActivePuzzle={props.setActivePuzzle} sounds={{ mouseUp: sounds["mouseUp"], mouseDown: sounds["mouseDown"] }} requests={props.requests}/>)
        //puzzleTargetSamples.push(<PuzzleTarget key={`${puzzle.zoneName}`} active={true} puzzle={puzzle} setActivePuzzle={props.setActivePuzzle} requests={props.requests}/>)
    }

    // Solver Game Panel \\
    return (
        <React.Fragment>
        
            <Background style={{ position: "absolute", zIndex: "0" }}/>
            
            <div className={styles.cloudScrollContainer}>

                <Clouds />

            </div>


            <div className={styles.boatContainer}>

                <img src={boat} style={{position: 'absolute'}}/>

                {/* Display Active Overlays */}
                { puzzleTargets }

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

            <div className={styles.waterScrollContainer}>

                <Water />
                <Water />
                <Water />

            </div>

            <div className={styles.captainContainer}>

                <div className={styles.captainsHeader} onMouseDown={() => { sounds["mouseDown"].play() }} onMouseUp={() => { sounds["mouseUp"].play() }} onClick={() => {

                    setVisibleCapList(visibleCapList ? false : true)

                }}>

                    <u style={{ fontSize: "105%", whiteSpace: "nowrap", display: "flex", alignItems: "center" }}>
                        
                        Captain List { visibleCapList ? <GoTriangleUp style={{ margin: "2%" }}/> : <GoTriangleDown style={{ padding: "2%" }}/> }
                    
                    </u>

                </div>

                <div style={{ visibility: visibleCapList ? "visible" : "hidden" }} className={styles.captainList}>
                    <span style={{ whiteSpace: "nowrap", fontSize: "80%", color: "white" }}><u>Ask these players for <b>answers</b>!</u></span>
                    <br/>
                    { props.gameInfo?.readerList?.map(readerName => <b>{readerName}</b>) ?? "" }
                </div>



            </div>


            <div id="activePuzzleContainer" className={gameStyles.hiddenPuzzle /* hiddenPuzzle, activePuzzle */}>

                <div id="puzzleAnswerOverlay" className={styles.inactiveAnswerOverlay /* inactiveAnswerOverlay, correctAnswerOverlay, incorrectAnswerOverlay */}/>

                <ImCross className={gameStyles.exitIcon} onClick={() => {
                    
                    // Animate the "activePuzzle" div out
                    const activePuzzleContainer = document.getElementById('activePuzzleContainer')
                    const shadow = document.getElementById('shadow')

                    if (activePuzzleContainer && shadow) {

                        // Tell any games that require timers to stop
                        const puzzleCloseEvent = new CustomEvent("puzzleClosed", {
                            detail: {
                                zoneName: props.activePuzzle.zoneName,
                            }
                        })
                        document.dispatchEvent(puzzleCloseEvent)

                        props.setActivePuzzle({ element: <div/>, zoneName: undefined })
                        activePuzzleContainer.className = gameStyles.hiddenPuzzle
                        shadow.style.zIndex = "-1"

                    }

                }}/>

                <div className={gameStyles.activeTopControls}>

                    <div className={gameStyles.zoneHeader}>
                        { toVisualZoneName(props.activePuzzle.zoneName!) }
                    </div>

                </div>


                { props.activePuzzle.element }
                

            </div>

        </React.Fragment>

    )
    
}
