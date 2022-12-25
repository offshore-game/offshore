import React, { useEffect } from 'react';
import { AuthProp } from '../../utils/propTypes';
import styles from './JoinGame.module.css';

export default function JoinGame(props: AuthProp) {
    return (
        <div className={styles.background}>
                
            <div id="home-container" className={styles.container}>

                <input type="text" id="roomCodeInput" className={styles.textInput} placeholder="Room Code" />
                <input type="text" id="usernameInput-Join" className={styles.textInput} placeholder="Username" />

                <div className={styles.buttons}>

                    <div className={styles.menuButton} onClick={async () => {
                        const username = document.getElementById("roomCodeInput") as HTMLTextAreaElement
                        const roomCode = document.getElementById("roomCodeInput") as HTMLTextAreaElement
                        
                        const result = await props.requests.joinLobby(username.value, roomCode.value).catch((err) => { throw err; })
                        console.log("joingame result: ", result)
                    }}>
                        Join Game
                    </div>

                </div>

            </div>
    
        </div>
    )
}
