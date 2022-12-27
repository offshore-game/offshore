import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { AuthProp } from '../../../utils/propTypes';
import styles from './Lobby.module.css'

export default function Lobby(props: AuthProp) {
    
    const navigate = useNavigate();
    const { id } = useParams();
    
    return (
        <div className={styles.background}>

            <div>
                User {localStorage.getItem("token")} Authenticated into Lobby {id}
            </div>



            <div className={styles.menuButton} onClick={async () => {

                const result = await props.requests.leaveLobby()

                if (result) {

                    localStorage.clear()
                    navigate(`/`, { replace: true })
                    return true;

                }

            }}>
                LEAVE
            </div>
            
        </div>
    )
}
