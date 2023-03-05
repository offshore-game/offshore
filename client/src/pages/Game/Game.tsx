import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { validateTokenEnums } from '../../API/types/enums';
import HealthBar from '../../components/HealthBar/HealthBar';
import NumberCombination from '../../Puzzles/NumberCombination/NumberCombination';
import ButtonCombination from '../../Puzzles/NumberCombination/NumberCombination';
import { AuthProp } from '../../utils/propTypes';
import styles from './Game.module.css'

export enum statusType {
    inGame = 0, // Started Game
    waitingGameEnd = 1, // Idle in lobby awaiting game end event.
}


// To act as a switch point for different components related to the game.
export default function Game(props: AuthProp) {

    const navigate = useNavigate();
    const { id } = useParams();
    
    const [status, setStatus] = useState(statusType.inGame);

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

        // FEATURE: Add an event listener in here to see when the game starts, so the frame can switch.

    }, [])
    

    // The game has started; show the game window.
    if (status == statusType.inGame) {

        return (

            <div className={styles.background}>
                
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

                <NumberCombination count={4} requests={props.requests}/>

            </div>

        )

    }

    return (<div/>) // Error suppresion.

}
