import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthProp } from '../../utils/propTypes'
import styles from './Home.module.css'

export default function Home(props: AuthProp) { // IDEA: Add all the home panels inside the same component, and then a prop that will just switch between them.
    const navigate = useNavigate();
    
    useEffect(() => {

        const canAuth = async () => {
            const token = localStorage.getItem("token")!
            const roomCode = localStorage.getItem("roomCode")!
    
            if (token && roomCode) {
                const result = await props.requests.rejoinLobby()
                if (result) {
                    
                    // Redirect user to the lobby.
                    navigate(`/game/${roomCode}`, { replace: true })
                    return true;
                    
                }
            }
        }

        canAuth()

    }, [])

    return (
        <div className={styles.background}>
                
            <div id="home-container" className={styles.container}>

                <div className={styles.buttons}>

                    <Link to="/create" className={styles.link}>

                        <div className={styles.menuButton}>
                            Create Game
                        </div>

                    </Link>



                    <Link to="/join" className={styles.link}>

                        <div className={styles.menuButton}>
                            Join Game
                        </div>

                    </Link>

                </div>

            </div>
    
        </div>
    )
}
