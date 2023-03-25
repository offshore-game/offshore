import { useNavigate } from 'react-router-dom'
import Button from '../../../components/Button/Button'
import { AuthProp } from '../../../utils/propTypes'
import Home from '../Home'
import styles from './Join.module.css'

export default function Join(props: AuthProp) {

    const nav = useNavigate()

    return (
        <Home>

            <input type="text" id="roomId-Join" className={styles.textInput} placeholder="Room ID" />
            <input type="text" id="usernameInput-Join" className={styles.textInput} placeholder="Username" />
            
            <Button className={styles.button} text={"Join Game"} onClick={async () => {
            
                const roomId = document.getElementById("roomId-Join") as HTMLTextAreaElement
                const username = document.getElementById("usernameInput-Join") as HTMLTextAreaElement
                                
                const result = await props.requests.joinLobby(username.value, roomId.value).catch((err) => { throw err; })

                if (result) {
                    
                    console.log(result)

                    // Redirect user to lobby
                    nav(`/lobby/${roomId.value}`, { replace: true, state: result })

                }

            }}/>

        </Home>

    )

}
