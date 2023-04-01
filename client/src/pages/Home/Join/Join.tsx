import { BiArrowBack } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import Button from '../../../components/Button/Button'
import { AuthProp } from '../../../utils/propTypes'
import Home from '../Home'
import baseStyles from '../Home.module.css'
import styles from './Join.module.css'

export default function Join(props: AuthProp) {

    const nav = useNavigate()

    return (
        <Home>

            <BiArrowBack className={styles.backButton} onClick={() => {

                nav(`/`, { replace: true }) 

            }}/>

            <input type="text" id="roomId-Join" className={baseStyles.textInput} placeholder="Room ID" onInput={(event) => {
                event.currentTarget.value = event.currentTarget.value.toUpperCase()
            }}/>
            <input type="text" id="usernameInput-Join" className={baseStyles.textInput} placeholder="Username" />
            
            <Button className={styles.submitButton} text={"Join Game"} onClick={async () => {
            
                const roomId = document.getElementById("roomId-Join") as HTMLTextAreaElement
                const username = document.getElementById("usernameInput-Join") as HTMLTextAreaElement
                                
                const result = await props.requests.joinLobby(username.value, roomId.value).catch((err) => { throw err; })

                if (result) {
                    
                    // Redirect user to lobby
                    nav(`/lobby/${roomId.value}`, { replace: true, state: [...result, username.value] })

                }

            }}/>

        </Home>

    )

}
