import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './Home.module.css'
import { io } from 'socket.io-client'

const socket = io("http://localhost:8080");

export default function Home() {

    const [isConnected, setIsConnected] = useState(socket.connected)
    const [token, setToken] = useState("")

    useEffect(() => {

        socket.on("connect", () => {
            console.log("connecting...")
            setIsConnected(true)
        })
    
        socket.on("disconnect", () => {
            setIsConnected(false)
        })

        socket.on("fetchToken", (token) => {
            setToken(token)
            console.log(`Token: ${token}`)
        })

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('pong');
        }

    }, []) // Empty array to tell React we only want this to run once.

    const requestToken = () => {
        console.log('requesting token')

        socket.emit('requestToken');
        socket.on('returnToken', (token: string) => {
            console.log(token)
        });
    }

    return (
        <div className={styles.background}>
            
            <div className={styles.container}>
                <input type="text" id="usernameInput" className={styles.username} />

                <div className={styles.buttons}>

                    <Link to="/create" className={styles.link}>

                        <div className={styles.menuButton} onClick={ requestToken }>
                            Create Game
                        </div>

                    </Link>



                    <Link to="/join" className={styles.link}>

                        <div className={styles.menuButton} onClick={ requestToken }>
                            Join Game
                        </div>

                    </Link>

                </div>
            </div>


        </div>
    )
}
