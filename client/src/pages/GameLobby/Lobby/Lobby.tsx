import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { AuthProp } from '../../../utils/propTypes';
import styles from './Lobby.module.css'

export default function Lobby(props: AuthProp) {
    
    const navigate = useNavigate();
    const { id } = useParams();
    const isOwner = localStorage.getItem("isOwner") == "true"

    // The server has closed the lobby.
    props.requests.socket.on("lobbyClose", () => {

        console.log("server has requested the lobby close")

        localStorage.clear()
        navigate(`/`, { replace: true })
        return true;

    })



    return (
        <div className={styles.background}>

            <div>
                User {localStorage.getItem("token")} Authenticated into Lobby {id}
            </div>



            <div className={styles.menuButton} onClick={async () => {

                const result = await props.requests.leaveLobby()

                if (result) {

                    localStorage.clear()
                    navigate(`/`, { replace: true })
                    return true;

                }

            }}>
                LEAVE
            </div>

            { isOwner ?             
                
                <div className={styles.menuButton} style={{ backgroundColor: "green" }} onClick={async () => {

                    const result = await props.requests.leaveLobby()

                    if (result) {

                        localStorage.clear()
                        navigate(`/`, { replace: true })
                        return true;

                    }

                }}>
                    START GAME
                </div>
            
            : <div />}

            
        </div>
    )
}
