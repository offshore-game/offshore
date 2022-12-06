import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Home.module.css'

export default function Home() {
    return (
        <div className={styles.container}>

            <input type="text" id="usernameInput" className={styles.username} />

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
    )
}
