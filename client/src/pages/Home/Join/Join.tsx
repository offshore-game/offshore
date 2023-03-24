import { useNavigate } from 'react-router-dom'
import Button from '../../../components/Button/Button'
import { AuthProp } from '../../../utils/propTypes'
import Home from '../Home'
import styles from './Join.module.css'

export default function Join(props: AuthProp) {

    const nav = useNavigate()

    return (
        <Home>

            <input type="text" id="usernameInput-Create" className={styles.textInput} placeholder="Username" />

            <Button className={styles.button} text={"Join Game"} onClick={async () => {
            
                const username = document.getElementById("usernameInput-Create") as HTMLTextAreaElement
                                
                const result = await props.requests.joinLobby(username.value, "need input here!!!!" /* BUG */).catch((err) => { throw err; })

                if (result) {
                    
                    console.log(result)

                    // Redirect user to lobby
                    nav(`/lobby/${result}`, { replace: true, state: result })

                    // Mark user as owner to prompt settings and start game pathways
                    localStorage.setItem("isOwner", "true")
                }

            }}/>

        </Home>

    )

}
