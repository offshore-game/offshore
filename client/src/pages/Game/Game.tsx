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
    waitingGameEnd = 1, // Idle in lobby awaiting game end event.
}

// Events
const newHealth = new CustomEvent("healthChange", {
    detail: {
        newHealth: 75
    }
})



// To act as a switch point for different components related to the game.
export default function Game(props: AuthProp) {

    const navigate = useNavigate();
    const { id } = useParams();

    const { state } = useLocation()

    const [ status, setStatus ] = useState(statusType.inGame);
    const [ gameInfo, setGameInfo ] = useState(undefined as any as gameInfo);
    const [ activePuzzle, setActivePuzzle ] = useState({ element: undefined, zoneName: undefined } as any as { element: JSX.Element, zoneName: zoneNames | undefined })

    useEffect(() => {

        const auth = async () => {

            const token = localStorage.getItem("token")
            const result = await props.requests.validateToken(token!, id!)
            
            if (result == validateTokenEnums.VALID) { // Everything looks good
                
                // We need to double check the socket is registered to game events.
                await props.requests.rejoinLobby().catch((err) => { throw err })
                return setStatus(statusType.inGame)

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
                    console.log('p change')
                    
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

        }

    })
    

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

                    SECONDS LENGTH: { gameInfo.lengthSec }
                    {/* My test cube :) */}
                    <div style={{height: "25px", width: "25px", backgroundColor: "black", position: "absolute", right: "10px", margin: "10px"}} onClick={() => {

                        document.dispatchEvent(newHealth)

                    }}/>

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

    return (<div/>) // Error suppresion.

}
