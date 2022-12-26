import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { validateTokenEnums } from '../../API/types/enums';
import { AuthProp } from '../../utils/propTypes';
import styles from './GameLobby.module.css'

export default function GameLobby(props: AuthProp) {

    const navigate = useNavigate();
    const { id } = useParams();
    const [authed, setAuthed] = useState(false); 

    useEffect(() => {

        const auth = async () => {

            const token = localStorage.getItem("token")
            const result = await props.requests.validateToken(token!, id!)
            
            if (result == validateTokenEnums.VALID) { // Everything looks good
                
                // We need to double check the socket is registered to game events.
                await props.requests.rejoinLobby().catch((err) => { throw err })

                return setAuthed(true)

            } else if (result == validateTokenEnums.TOKEN_INVALID) { // We can just re-sign in the user
                
                localStorage.setItem("token", "") // Wipe the invalid token
                return setAuthed(false)

            } else if (result == validateTokenEnums.ROOM_INVALID) { // Room doesn't exist anymore.
                
                localStorage.setItem("token", "")
                localStorage.setItem("roomCode", "")
                return navigate("/", { replace: true }) // Redirect home.

            }

        }
        auth()

    }, [])
    
    if (authed) {

        // User is authenticated; show them the game lobby.
        return (
            <div className={styles.background}>
                USER AUTHENTICATED AS {localStorage.getItem("token")}
                ID: {`${id}`}
            </div>
        )

    } else if (!authed) {
        
        // User is not authenticated; show them a page to enter a username and join the lobby.
        return (
            <div className={styles.background}>
                USER UNAUTHENTICATED
                ID: {`${id}`}
            </div>
        )

    }

    return (<div/>) // Error suppresion.

}
