import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './Home.module.css'

export default function Home(props: any) { // IDEA: Add all the home panels inside the same component, and then a prop that will just switch between them.

    return (
        <div className={styles.background}>
                
            <div id="home-container" className={styles.container}>

                <input type="text" id="usernameInput" className={styles.username}/>

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
