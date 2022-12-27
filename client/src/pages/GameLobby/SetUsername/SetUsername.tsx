import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { AuthProp } from '../../../utils/propTypes'
import { statusType } from '../Game';
import styles from './SetUsername.module.css'

type statusProp = {
    statusSetter: Function
}

export default function SetUsername(props: AuthProp & statusProp) {

    const navigate = useNavigate();
    const { id } = useParams();

    return (
        <div className={styles.background}>
            <div id="home-container" className={styles.container}>

                You are attempting to join lobby {id}
                <input type="text" id="usernameInput-Join" className={styles.textInput} placeholder="Username" />

                <div className={styles.buttons}>

                    <div className={styles.menuButton} onClick={async () => {
                        const username = document.getElementById("usernameInput-Join") as HTMLTextAreaElement
                        console.log('pressed')
                        const result = await props.requests.joinLobby(username.value, id!).catch((err) => { throw err; })
                        if (result) {

                            // Set status to authentication
                            return props.statusSetter(statusType.inLobby)

                        }
                        console.log("joingame result: ", result)
                    }}>
                        Join Game
                    </div>

                </div>

            </div>
        </div>
    )

}
