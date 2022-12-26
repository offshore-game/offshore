import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { validateTokenEnums } from '../../API/types/enums';
import { AuthProp } from '../../utils/propTypes';
import styles from './GameLobby.module.css'

enum statusType {
    needAuth = 0,
    inLobby = 1,
    inGame = 2,
    waitingGameEnd = 3, // Idle in lobby awaiting game end event.
}

export default function GameLobby(props: AuthProp) {

    const navigate = useNavigate();
    const { id } = useParams();

    const [status, setStatus] = useState(statusType.inLobby);

    useEffect(() => {

        const auth = async () => {

            const token = localStorage.getItem("token")
            const result = await props.requests.validateToken(token!, id!)
            
            if (result == validateTokenEnums.VALID) { // Everything looks good
                
                // We need to double check the socket is registered to game events.
                await props.requests.rejoinLobby().catch((err) => { throw err })

                return setStatus(statusType.inLobby)

            } else if (result == validateTokenEnums.TOKEN_INVALID) { // We can just re-sign in the user
                
                localStorage.setItem("token", "") // Wipe the invalid token
                return setStatus(statusType.needAuth)

            } else if (result == validateTokenEnums.ROOM_INVALID) { // Room doesn't exist anymore.
                
                localStorage.setItem("token", "")
                localStorage.setItem("roomCode", "")
                return navigate("/", { replace: true }) // Redirect home.

            }

        }
        auth()

        // FEATURE: Add an event listener in here to see when the game starts, so the frame can switch.

    }, [])
    

    // The game has not started.
    if (status != statusType.inGame) {

        // User is authenticated; show them the game lobby.
        if (status == statusType.inLobby) {

            return (
                <div className={styles.background}>
                    <div>
                        User {localStorage.getItem("token")} Authenticated into Lobby {id}
                    </div>
    
                    <div className={styles.menuButton} onClick={() => {

                        localStorage.clear()
                        navigate(`/`, { replace: true })
                        return true;

                    }}>
                        LEAVE
                    </div>
                </div>
            )
    
            // User is not authenticated; show them a page to enter a username and join the lobby.
        } else if (status == statusType.needAuth) {
            
            return (
                <div className={styles.background}>
                    <div id="home-container" className={styles.container}>

                        You are attempting to join lobby {id}
                        <input type="text" id="usernameInput-Join" className={styles.textInput} placeholder="Username" />

                        <div className={styles.buttons}>

                            <div className={styles.menuButton} onClick={async () => {
                                const username = document.getElementById("usernameInput-Join") as HTMLTextAreaElement
                                console.log('pressed')
                                const result = await props.requests.joinLobby(username.value, id!).catch((err) => { throw err; })
                                if (result) {

                                    // Set status to authentication
                                    return setStatus(statusType.inLobby)

                                }
                                console.log("joingame result: ", result)
                            }}>
                                Join Game
                            </div>

                        </div>

                    </div>
                </div>
            )
    
        }

    // The game has started; don't show the lobby, show the game frame itself (with all the events).
    } else if (status == statusType.inGame) {

        

    }

    return (<div/>) // Error suppresion.

}
