import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './GameLobby.module.css'

export default function GameLobby(props: any) {

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {

        const roomCode = localStorage.getItem("roomCode")
        // DEBUG: Add an API call to see if the code is still valid. If it isn't wipe the code and token and redirect home.
        if (roomCode != id) navigate("/", { replace: true }) // Prevent bugs from invalid links

    }, [])
    
    return (
        <div className={styles.background}>
            ID: {`${id}`}
        </div>
    )

}