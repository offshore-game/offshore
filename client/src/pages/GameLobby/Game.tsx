import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { validateTokenEnums } from '../../API/types/enums';
import { AuthProp } from '../../utils/propTypes';
import Lobby from './Lobby/Lobby';
import SetUsername from './SetUsername/SetUsername';


export enum statusType {
    needAuth = 0,
    inLobby = 1,
    inGame = 2,
    waitingGameEnd = 3, // Idle in lobby awaiting game end event.
}


// To act as a switch point for different components related to the game.
export default function Game(props: AuthProp) {

    const navigate = useNavigate();
    const { id } = useParams();
    
    const location = useLocation();
    const otherPlayers = location.state // Passed from JoinGame.tsx
    
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

            return <Lobby requests={props.requests} otherPlayers={otherPlayers}/>
    
        // User is not authenticated; show them a page to enter a username and join the lobby.
        } else if (status == statusType.needAuth) {
            
            return <SetUsername requests={props.requests} statusSetter={setStatus} />
    
        }

    // The game has started; don't show the lobby, show the game frame itself (with all the events).
    } else if (status == statusType.inGame) {

        

    }

    return (<div/>) // Error suppresion.

}
