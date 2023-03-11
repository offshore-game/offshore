import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { gameInfo, zoneNames } from '../../API/requests';
import { validateTokenEnums } from '../../API/types/enums';
import HealthBar from '../../components/HealthBar/HealthBar';
import { AuthProp } from '../../utils/propTypes';
import styles from './Game.module.css'
import PuzzleTarget from './PuzzleTarget/PuzzleTarget';

export enum statusType {
    inGame = 0, // Started Game
    startCutscene = 1, // Cutscene
    successEnding = 2,
    failEnding = 3,
    leaderboard = 4,
}

// To act as a switch point for different components related to the game.
export default function Game(props: AuthProp) {

    const navigate = useNavigate();
    const { id } = useParams();

    const { state } = useLocation()

    const [ status, setStatus ] = useState(statusType.startCutscene);
    const [ gameInfo, setGameInfo ] = useState(undefined as any as gameInfo);
    const [ activePuzzle, setActivePuzzle ] = useState({ element: undefined, zoneName: undefined } as any as { element: JSX.Element, zoneName: zoneNames | undefined })

    const [ gameTimer, setGameTimer ] = useState(gameInfo ? gameInfo.lengthSec : 0)
    const [ gameTimerCountdown, setTimerFunction ] = useState(undefined as any)

    useEffect(() => {

        const auth = async () => {

            const token = localStorage.getItem("token")
            const result = await props.requests.validateToken(token!, id!)
            
            if (result == validateTokenEnums.VALID) { // Everything looks good
                
                // We need to double check the socket is registered to game events.
                await props.requests.rejoinLobby().catch((err) => { throw err })
                return setStatus(statusType.startCutscene)

            } else if (result == validateTokenEnums.TOKEN_INVALID) { // User doesn't have authorization for this.
                
                localStorage.setItem("token", "")
                localStorage.setItem("roomCode", "")
                return navigate("/", { replace: true }) // Redirect home.

            } else if (result == validateTokenEnums.ROOM_INVALID) { // Room doesn't exist anymore.
                
                localStorage.setItem("token", "")
                localStorage.setItem("roomCode", "")
                return navigate("/", { replace: true }) // Redirect home.

            }

        }
        auth()

        setGameInfo(state)

        // FEATURE: Add an event listener in here to see when the game starts, so the frame can switch.

    }, [])


    // Event Listeners for Game Events \\
    useEffect(() => {

        const puzzleChangeFunction = (payload: { newGameInfo: gameInfo }) => {

            /*
                1) Check if the active puzzle was changed
                2) Set gameInfo's puzzle array again
            */

            const newGameInfo = payload.newGameInfo
            const newPuzzles = newGameInfo.puzzles

            // If ACTIVE puzzle is not found in the new puzzle array
            if (newPuzzles.findIndex(puzzle => activePuzzle.zoneName == puzzle.zoneName) == -1) {
                
                // Wipe and Close the activePuzzle module
                const activePuzzleContainer = document.getElementById('activePuzzleContainer')
                const shadow = document.getElementById('shadow')

                if (activePuzzleContainer && shadow) {

                    // Delay it only to show the correct answer animation
                    setTimeout(() => {

                        setActivePuzzle({ element: <div/>, zoneName: undefined })
                        activePuzzleContainer.className = styles.hiddenPuzzle
                        shadow.style.zIndex = "-1"

                    }, 1000)

                }

            }

            return setGameInfo(newGameInfo);

        }
        props.requests.socket.on("puzzleChange", puzzleChangeFunction)

        const gameOverFunction = (payload: { success: boolean, leaderboard: any[] }) => {

            setTimeout(() => { setStatus(payload.success ? statusType.successEnding : statusType.failEnding) }, 2000)

        }
        props.requests.socket.on("gameOver", gameOverFunction)

        const resultFunction = (event: any) => {

            const zoneName = event.detail.zoneName as zoneNames
            const correct = event.detail.result as boolean

            if (activePuzzle.zoneName == zoneName) {
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
            props.requests.socket.off("puzzleChange", puzzleChangeFunction)
            props.requests.socket.off("gameOver", gameOverFunction)

        }

    })
    
    // Game Timer
    useEffect(() => {

        if (status == statusType.inGame) {

            setTimerFunction(setInterval(() => {
                setGameTimer(prevTime => prevTime - 1)
            }, 1000))

        } else {

            clearInterval(gameTimerCountdown)
            setTimerFunction(undefined)

        }

    }, [status])

    
    function getStageNumber() {

        if (gameTimer <= 60) {
            
            return 5

        } else if (gameTimer <= 120) {

            return 4

        } else if (gameTimer <= 180) {

            return 3

        } else if (gameTimer <= 240) {

            return 2

        } else {

            return 1

        }

    }

    function fmtMSS(s: number){return(s-(s%=60))/60+(9<s?':':':0')+s}

    // The game has started; show the game window.
    if (status == statusType.inGame) {

        if (!gameInfo) return (<div/>)

        // TESTING \\
        const puzzleTargetSamples = []
        for (const puzzle of gameInfo.puzzles) {

            puzzleTargetSamples.push(<PuzzleTarget active={true} zoneName={puzzle.zoneName} gameInfo={gameInfo} setActivePuzzle={setActivePuzzle} requests={props.requests}/>)

        }

        if (gameInfo) {

            return (
                
                <div className={styles.background}>
                    
                    <div id="shadow" className={styles.shadow} onClick={() => {

                        // Animate the "activePuzzle" div out
                        const activePuzzleContainer = document.getElementById('activePuzzleContainer')
                        const shadow = document.getElementById('shadow')

                        if (activePuzzleContainer && shadow) {

                            setActivePuzzle({ element: <div/>, zoneName: undefined })
                            activePuzzleContainer.className = styles.hiddenPuzzle
                            shadow.style.zIndex = "-1"

                        }

                    }}/>

                    SECONDS LENGTH: { fmtMSS(gameTimer) }
                    <br/>
                    STAGE: Stage {getStageNumber()}

                    <div className={styles.topBar}>

                        <HealthBar percentage={100} requests={props.requests}/>

                    </div>

                    

                    { puzzleTargetSamples }



                    <div id="activePuzzleContainer" className={styles.hiddenPuzzle /* hiddenPuzzle, activePuzzle */}>

                        <div id="puzzleAnswerOverlay" className={styles.inactiveAnswerOverlay /* inactiveAnswerOverlay, correctAnswerOverlay, incorrectAnswerOverlay */}/>

                        <div className={styles.exitCube} onClick={() => {
                            // Animate the "activePuzzle" div out
                            const activePuzzleContainer = document.getElementById('activePuzzleContainer')
                            const shadow = document.getElementById('shadow')

                            if (activePuzzleContainer && shadow) {

                                setActivePuzzle({ element: <div/>, zoneName: undefined })
                                activePuzzleContainer.className = styles.hiddenPuzzle
                                shadow.style.zIndex = "-1"

                            }

                        }}/>
                        { activePuzzle.element }
                        

                    </div>

                    

                </div>

            )

        }
        
    }

    // The game is at the start cutscene; display it.
    if (status == statusType.startCutscene) {

        // After 5 seconds, set it to the game
        setTimeout(() => { setGameTimer(gameInfo.lengthSec); setStatus(statusType.inGame) }, 5000)

        return (
            <div style={{height: "100vh", width: "100vw", backgroundColor: "black"}}/>
        )

    }

    // The game is at the good ending cutscene; display it.
    if (status == statusType.successEnding) {

        // After 5 seconds, show the leaderboard
        setTimeout(() => { setStatus(statusType.leaderboard) }, 5000)

        return (
            <div style={{height: "100vh", width: "100vw", backgroundColor: "green"}}/>
        )

    }

    // The game is at the failed ending cutscene; display it.
    if (status == statusType.failEnding) {

        return (
            <div style={{height: "100vh", width: "100vw", backgroundColor: "red"}}/>
        )

    }

    return (<div/>) // Error suppresion.

}
