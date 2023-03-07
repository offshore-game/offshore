import React, { useState } from 'react'
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { startGamePayload } from '../../../API/requests';
import { AuthProp } from '../../../utils/propTypes';
import styles from './LobbyView.module.css'

type LobbyProp = {

    otherPlayers: string[] | undefined,
    setLobbyState: Function,

}

export default function LobbyView(props: AuthProp & LobbyProp) {
    
    const navigate = useNavigate();
    const { id } = useParams();

    const isOwner = localStorage.getItem("isOwner") == "true"
    const username = localStorage.getItem("username")
    const roomCode = localStorage.getItem("roomCode")

    const [usernameBoardEntries, setUsernameBoardEntries] = useState([<div key={username}>{username}</div>])


    useEffect(() => {
        
        const auth = async () => {
            // Attempt to rejoin the lobby if we are not already authenticated in.
            await props.requests.rejoinLobby().catch((err) => {
                props.setLobbyState(false);
                navigate('/', { replace: true });
            })
        }
        auth()
        

        const otherPlayers = props.otherPlayers
        if (otherPlayers) {

            for (const username of otherPlayers) {
                setUsernameBoardEntries(entries => [...entries, <div key={username}>{username}</div>])
            }

        }

        // REGISTER LOBBY EVENTS \\
        
        // The server has closed the lobby.
        props.requests.socket.on("lobbyClose", () => {

            console.log("server has requested the lobby close")

            localStorage.clear()
            navigate(`/`, { replace: true })
            navigate(0) // Reload the page to wipe the socket
            return true;

        })


        props.requests.socket.on("playerJoin", (username: string) => {

            // Add the new entry to the list
            setUsernameBoardEntries(entries => [...entries, <div key={username}>{username}</div>])

        })

        props.requests.socket.on("playerLeave", (username: string) => {

            // Filter out any entries that has the old username.
            setUsernameBoardEntries(usernameBoardEntries.filter(entry => entry.key !== username))

        })

        console.log("socket: ", props.requests.socket)

        props.requests.socket.on("gameStart", (payload: startGamePayload) => {

            navigate(`/game/${roomCode}`, { replace: true, state: payload }) // Navigate to the game page

        })


    }, [])


    return (
        <div className={styles.background}>

            <div>
                User {localStorage.getItem("username")} Authenticated into Lobby {id}
            </div>



            <div className={styles.menuButton} onClick={async () => {

                // We don't check for the callback value of "result" because we don't want to hang the client if
                // their socket was reset and they are trying to leave. This was a tested bug.
                const result = await props.requests.leaveLobby().catch((err) => {})

                localStorage.clear() // Clear all variables in storage
                navigate(`/`, { replace: true }) // Go back home
                navigate(0) // Reload the page to wipe the socket and establish a new connection.
                return true;


            }}>
                LEAVE
            </div>

            { isOwner ?             
                
                <div className={styles.menuButton} style={{ backgroundColor: "green" }} onClick={async () => {

                    // Request to the server to start the game.
                    const result = await props.requests.startGame()

                    if (result) {

                        navigate(`/game/${roomCode}`, { replace: true, state: result }) // Navigate to the game page
                        return true;

                    }

                }}>
                    START GAME
                </div>
            
            : <div />}

            { usernameBoardEntries }
            
        </div>
    )
}
