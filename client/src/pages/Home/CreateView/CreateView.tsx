import { useNavigate } from 'react-router-dom';
import Button from '../../../components/Button/Button';
import { AuthProp } from '../../../utils/propTypes';
import styles from './CreateView.module.css'

type CreateViewProp = {

    setCreateState: Function,

}

export default function CreateView(props: AuthProp & CreateViewProp) {

    const navigate = useNavigate();

    return (
        <div>

            <div onClick={() => {
            
                // Pass state up
                props.setCreateState(false);

                navigate(`/`, { replace: true }) 

            }}>Back Button?</div>

            <input type="text" id="usernameInput-Create" className={styles.textInput} placeholder="Username" />

            <Button text={"Create Game"} onClick={async () => {
                const username = document.getElementById("usernameInput-Create") as HTMLTextAreaElement
                                
                const result = await props.requests.createLobby(username.value).catch((err) => { throw err; })

                if (result) {
                    
                    // Redirect user to game
                    navigate(`/game/${result}`, { replace: true })

                    // Mark user as owner to prompt settings and start game pathways
                    localStorage.setItem("isOwner", "true")
                }
            }}/>

        </div>
    )

}