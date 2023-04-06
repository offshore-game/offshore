import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { validateTokenEnums } from "../../API/types/enums";
import { AuthProp } from "../../utils/propTypes";
import styles from './Game.module.css'
import SolverGame from "./Views/Solver/SolverGame";
import { gameInfo, PuzzleInfo, zoneNames } from "../../API/requests";
import { fmtMSS } from "../../utils/SecondsConversion";
import HealthBar from "../../components/HealthBar/HealthBar";
import ReaderGame from "./Views/Reader/ReaderGame";
import { BiCoinStack } from 'react-icons/bi'
import { TbClock } from 'react-icons/tb'
import Cutscene from "../../components/Cutscene/Cutscene";
import Leaderboard from "../../components/Leaderboard/Leaderboard";

export enum statusType {
    inGame = 0, // Started Game
    startCutscene = 1, // Cutscene
    successEnding = 2,
    failEnding = 3,
}

// To act as a switch point for different components related to the game.
export default function GameSwitchPoint(props: AuthProp) {

    const navigate = useNavigate();
    const { id } = useParams();

    const { state } = useLocation()

    const [ status, setStatus ] = useState(statusType.startCutscene);
    const [ userRole, setUserRole ] = useState(undefined as ("READER" | "SOLVER" | undefined))
    const [ activePuzzle, setActivePuzzle ] = useState({ element: undefined, zoneName: undefined } as any as { element: JSX.Element, zoneName: zoneNames | undefined })

    const [ gameInfo, setGameInfo ] = useState(state as gameInfo);

    
    const [ gameTimer, setGameTimer ] = useState(state ? state.lengthSec as number : 0)
    const [ gameTimerCountdown, setTimerFunction ] = useState(undefined as any)

    const stageText = useRef(undefined as any as HTMLDivElement)

    const [ coins, setCoins ] = useState(0)

    const [ leaderboard, setLeaderboard ] = useState([] as { username: string, coins: number }[])

    // Authorize
    useEffect(() => {

        const auth = async () => {

            const token = sessionStorage.getItem("token")
            const result = await props.requests.validateToken(token!, id!)
            
            if (result == validateTokenEnums.VALID) { // Everything looks good
                
                // We need to double check the socket is registered to game events.
                await props.requests.rejoinLobby().catch((err) => { throw err })
                console.log("ROLE:", state.role)
                return setUserRole(state.role) // arbitrary for now
    
            } else if (result == validateTokenEnums.TOKEN_INVALID) { // User doesn't have authorization for this.
                
                sessionStorage.setItem("token", "")
                sessionStorage.setItem("roomCode", "")
                return navigate("/", { replace: true }) // Redirect home.
    
            } else if (result == validateTokenEnums.ROOM_INVALID) { // Room doesn't exist anymore.
                
                sessionStorage.setItem("token", "")
                sessionStorage.setItem("roomCode", "")
                return navigate("/", { replace: true }) // Redirect home.
    
            }
    
        }
        auth()
    
    }, [])

    // Universal Game Events \\
    useEffect(() => {
    
        const puzzleChangeFunction = (payload: { lengthSec: number, readerList: string[], puzzles: PuzzleInfo[] }) => {

            /*
                1) Check if the active puzzle was changed
                2) Set gameInfo's puzzle array again
            */

            const newPuzzles = payload.puzzles
     
            // Wipe and Close the activePuzzle module
            const activePuzzleContainer = document.getElementById('activePuzzleContainer')
            const shadow = document.getElementById('shadow')

            if (activePuzzleContainer && shadow && activePuzzle.zoneName) {

                // If ACTIVE puzzle is not found in the new puzzle array
                if (newPuzzles.findIndex(puzzle => activePuzzle.zoneName == puzzle.zoneName) == -1) {

                    // Delay it only to show the correct answer animation
                    let timeout = setTimeout(() => {

                        // Logic Issue: what if the active puzzle changes though

                        // Tell any games that require timers to stop
                        const puzzleCloseEvent = new CustomEvent("puzzleClosed", {
                            detail: {
                                zoneName: activePuzzle.zoneName,
                            }
                        })
                        document.dispatchEvent(puzzleCloseEvent)

                        // Related to a visual bug fix
                        document.removeEventListener("puzzleClosed", killTimeout)

                        setActivePuzzle({ element: <div/>, zoneName: undefined })
                        activePuzzleContainer.className = styles.hiddenPuzzle
                        shadow.style.zIndex = "-1"
                            
                    }, 1000)

                    // Related to a visual bug fix
                    const killTimeout = () => {
                        clearTimeout(timeout)
                    }
                    document.addEventListener("puzzleClosed", killTimeout)

                
                }

            }

            return setGameInfo(payload);

        }
        props.requests.socket.on("puzzleChange", puzzleChangeFunction)

        const pointsChangedFunction = (payload: { newPoints: number }) => {

            setCoins(payload.newPoints)

        }
        props.requests.socket.on("pointsChanged", pointsChangedFunction)
        
        const gameOverFunction = (payload: { success: boolean, leaderboard: { username: string, coins: number }[] | undefined }) => {

            if (payload.success) setLeaderboard(payload.leaderboard!);
            
            setTimeout(() => { setStatus(payload.success ? statusType.successEnding : statusType.failEnding) }, 2000)

        }
        props.requests.socket.on("gameOver", gameOverFunction)

        return () => {

            props.requests.socket.off("puzzleChange", puzzleChangeFunction)
            props.requests.socket.off("pointsChanged", pointsChangedFunction)
            props.requests.socket.off("gameOver", gameOverFunction)

        }

    })

    // Game Timer
    useEffect(() => {

        if (status == statusType.inGame) {

            setTimerFunction(setInterval(() => {
                setGameTimer(prevTime => prevTime - 1)

                if (stageText.current) {
                    stageText.current.className = (stageText.current.className == styles.centerInfo ? styles.redCenterInfo : styles.centerInfo) 
                }
            }, 1000))

        } else {

            clearInterval(gameTimerCountdown)
            setTimerFunction(undefined)

        }

    }, [status])

    
    function getStageNumber() {

        if (gameTimer <= 60) {
            
            return "Five"

        } else if (gameTimer <= 120) {

            return "Four"

        } else if (gameTimer <= 180) {

            return "Three"

        } else if (gameTimer <= 240) {

            return "Two"

        } else {

            return "One"

        }

    }

    // The game has started
    if (status == statusType.inGame) {

        return (
            <div className={styles.background}>
                
                <div id="shadow" className={styles.shadow} onClick={() => {

                    // Animate the "activePuzzle" div out
                    const activePuzzleContainer = document.getElementById('activePuzzleContainer')
                    const shadow = document.getElementById('shadow')
    
                    if (activePuzzleContainer && shadow) {
                        
                        // Tell any games that require timers to stop
                        const puzzleCloseEvent = new CustomEvent("puzzleClosed", {
                            detail: {
                                zoneName: activePuzzle.zoneName,
                            }
                        })
                        document.dispatchEvent(puzzleCloseEvent)

                        setActivePuzzle({ element: <div/>, zoneName: undefined })
                        activePuzzleContainer.className = styles.hiddenPuzzle
                        shadow.style.zIndex = "-1"
    
                    }
    
                }}/>
    

                <div className={styles.topBar}>
    
                    <HealthBar percentage={100} requests={props.requests}/>

                    <div ref={stageText} className={styles.centerInfo}>

                        Stage {getStageNumber()}

                    </div>

                    <div className={styles.rightInfo}>

                        <div className={styles.rightInfoContainer}>
                            <TbClock className={styles.clockIcon}/>
                            { fmtMSS(gameTimer) }
                        </div>

                        <div className={styles.rightInfoContainer}>
                            <BiCoinStack className={styles.coinIcon}/>
                            { coins }
                        </div>


                        
                    </div>

    
                </div>

                { userRole == "SOLVER" ? <SolverGame gameInfo={gameInfo} setGameInfo={setGameInfo} activePuzzle={activePuzzle} setActivePuzzle={setActivePuzzle} requests={props.requests}/> : <ReaderGame gameInfo={gameInfo} setGameInfo={setGameInfo} requests={props.requests}/> }
            </div>
        )

    }

    // The game is at the start cutscene
    if (status == statusType.startCutscene) {

        // After 21 seconds, show the game
        setTimeout(() => { setStatus(statusType.inGame) }, (21 * 1000))

        return (<Cutscene type={"INTRO"} />)

    }

    // The game is at the good ending cutscene; display it.
    if (status == statusType.successEnding) {

        return (<Cutscene type={"PASS"} leaderboard={ leaderboard } />)

    }

    // The game is at the failed ending cutscene; display it.
    if (status == statusType.failEnding) {

        return (<Cutscene type={"FAIL"} />)

    }

    return (<div/>) // Error suppresion.

    /*if (!userRole) return <div/>

    if (userRole == "SOLVER") {

        return <SolverGame requests={props.requests} gameInfo={state}/>

    }*/

}