import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthProp } from '../../utils/propTypes';
import styles from './CreateGame.module.css';

export default function CreateGame(props: AuthProp) {
    const navigate = useNavigate();
    
    return (
        <div className={styles.background}>
                
            <div id="home-container" className={styles.container}>

                <input type="text" id="usernameInput-Create" className={styles.textInput} placeholder="Username" />

                <div className={styles.buttons}>

                    <div className={styles.menuButton} onClick={async () => {
                        const username = document.getElementById("usernameInput-Create") as HTMLTextAreaElement
                        
                        const result = await props.requests.createLobby(username.value).catch((err) => { throw err; })

                        if (result) {
                            
                            // Redirect user to game
                            navigate(`/game/${result}`, { replace: true })

                            // Mark user as owner to prompt settings and start game pathways
                            localStorage.setItem("isOwner", "true")

                        }
                    }}>
                        Create Game
                    </div>

                </div>

            </div>
    
        </div>
    )
}
