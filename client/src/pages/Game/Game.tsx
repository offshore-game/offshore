    import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { startGamePayload } from '../../API/requests';
import { validateTokenEnums } from '../../API/types/enums';
import HealthBar from '../../components/HealthBar/HealthBar';
import NumberCombination from '../../Puzzles/NumberCombination/NumberCombination';
import ButtonCombination from '../../Puzzles/NumberCombination/NumberCombination';
import { AuthProp } from '../../utils/propTypes';
import styles from './Game.module.css'
import PuzzleTarget from './PuzzleTarget/PuzzleTarget';

export enum statusType {
    inGame = 0, // Started Game
    waitingGameEnd = 1, // Idle in lobby awaiting game end event.
}


// To act as a switch point for different components related to the game.
export default function Game(props: AuthProp) {

    const navigate = useNavigate();
    const { id } = useParams();

    const { state } = useLocation()

    const [status, setStatus] = useState(statusType.inGame);
    const [ gameInfo, setGameInfo ] = useState(undefined as any as startGamePayload);
    const [ activePuzzle, setActivePuzzle ] = useState(undefined as any as JSX.Element)

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
    

    // The game has started; show the game window.
    if (status == statusType.inGame) {

        if (!gameInfo) {console.log('no game info'); return (<div/>)}

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

                            setActivePuzzle(undefined as any)
                            activePuzzleContainer.className = styles.hiddenPuzzle
                            shadow.style.zIndex = "-1"

                        }

                    }}/>

                    SECONDS LENGTH: { gameInfo.lengthSec }
                    {/* My test cube :) */}
                    <div style={{height: "25px", width: "25px", backgroundColor: "black", position: "absolute", right: "10px", margin: "10px"}} onClick={() => {

                        // Fire Event
                        const newHealth = new CustomEvent("healthChange", {
                            detail: {
                                newHealth: 75
                            }
                        })

                        document.dispatchEvent(newHealth)

                    }}/>

                    <div className={styles.topBar}>

                        <HealthBar percentage={100}/>

                    </div>

                    

                    { puzzleTargetSamples }



                    <div id="activePuzzleContainer" className={styles.hiddenPuzzle /* hiddenPuzzle, activePuzzle */}>

                        <div className={styles.exitCube} onClick={() => {
                            // Animate the "activePuzzle" div out
                            const activePuzzleContainer = document.getElementById('activePuzzleContainer')
                            const shadow = document.getElementById('shadow')

                            if (activePuzzleContainer && shadow) {

                                setActivePuzzle(undefined as any)
                                activePuzzleContainer.className = styles.hiddenPuzzle
                                shadow.style.zIndex = "-1"

                            }

                        }}/>
                        { activePuzzle }
                        

                    </div>

                    

                </div>

            )

        }
        
    }

    return (<div/>) // Error suppresion.

}
