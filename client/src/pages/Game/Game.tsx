import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { validateTokenEnums } from "../../API/types/enums";
import { AuthProp } from "../../utils/propTypes";
import styles from './Views/Solver/SolverGame.module.css'
import SolverGame from "./Views/Solver/SolverGame";
import { gameInfo, zoneNames } from "../../API/requests";
import { fmtMSS } from "../../utils/SecondsConversion";
import HealthBar from "../../components/HealthBar/HealthBar";

export enum statusType {
    inGame = 0, // Started Game
    startCutscene = 1, // Cutscene
    successEnding = 2,
    failEnding = 3,
    leaderboard = 4,
}


// To act as a switch point for different components related to the game.
export default function GameSwitchPoint(props: AuthProp) {

    const navigate = useNavigate();
    const { id } = useParams();

    const { state } = useLocation()

    const [ status, setStatus ] = useState(statusType.startCutscene);
    const [userRole, setUserRole] = useState(undefined as ("READER" | "SOLVER" | undefined))
    const [ activePuzzle, setActivePuzzle ] = useState({ element: undefined, zoneName: undefined } as any as { element: JSX.Element, zoneName: zoneNames | undefined })

    const [ gameInfo, setGameInfo ] = useState(state as gameInfo);

    
    const [ gameTimer, setGameTimer ] = useState(state ? state.lengthSec as number : 0)
    const [ gameTimerCountdown, setTimerFunction ] = useState(undefined as any)

    const [ coins, setCoins ] = useState(0)

    // Authorize
    useEffect(() => {

        const auth = async () => {

            const token = localStorage.getItem("token")
            const result = await props.requests.validateToken(token!, id!)
            
            if (result == validateTokenEnums.VALID) { // Everything looks good
                
                // We need to double check the socket is registered to game events.
                await props.requests.rejoinLobby().catch((err) => { throw err })
                return setUserRole("SOLVER") // arbitrary for now
    
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
    
    }, [])

    // Universal Game Events \\
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

        const pointsChangedFunction = (payload: { newPoints: number }) => {

            setCoins(payload.newPoints)

        }
        props.requests.socket.on("pointsChanged", pointsChangedFunction)
        
        const gameOverFunction = (payload: { success: boolean, leaderboard: any[] }) => {

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

    // The game has started
    if (status == statusType.inGame) {

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
                <br/>
                COINS: { coins }
    
                <div className={styles.topBar}>
    
                    <HealthBar percentage={100} requests={props.requests}/>
    
                </div>

                <SolverGame gameInfo={gameInfo} setGameInfo={setGameInfo} activePuzzle={activePuzzle} setActivePuzzle={setActivePuzzle} requests={props.requests}/>
            </div>
        )

    }

    // The game is at the start cutscene
    if (status == statusType.startCutscene) {

        // After 5 seconds, show the game
        setTimeout(() => { setStatus(statusType.inGame) }, 5000)

        return (<div/>)

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

    /*if (!userRole) return <div/>

    if (userRole == "SOLVER") {

        return <SolverGame requests={props.requests} gameInfo={state}/>

    }*/

}