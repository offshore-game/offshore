import React, { useState } from 'react'
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthProp } from '../../../utils/propTypes';
import styles from './Lobby.module.css'

type LobbyProps = {
    otherPlayers: string[]
}

export default function Lobby(props: AuthProp & LobbyProps) {
    
    const navigate = useNavigate();
    const { id } = useParams();

    const isOwner = localStorage.getItem("isOwner") == "true"
    const username = localStorage.getItem("username")

    const [usernameBoardEntries, setUsernameBoardEntries] = useState([<div key={username}>{username}</div>])

    useEffect(() => {

        if (props.otherPlayers) {

            const newEntries: any[] = [] // I REALLY don't want to write types for this lol
            for (const username of props.otherPlayers) {
                setUsernameBoardEntries(entries => [...entries, <div key={username}>{username}</div>])
            }

        }

        console.log(props.otherPlayers)
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

    }, [])

    return (
        <div className={styles.background}>

            <div>
                User {localStorage.getItem("username")} Authenticated into Lobby {id}
            </div>



            <div className={styles.menuButton} onClick={async () => {

                const result = await props.requests.leaveLobby()

                if (result) {

                    localStorage.clear() // Clear all variables in storage
                    navigate(`/`, { replace: true }) // Go back home
                    navigate(0) // Reload the page to wipe the socket and establish a new connection.
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

            { usernameBoardEntries }
            
        </div>
    )
}
