import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button/Button";
import { AuthProp } from "../../../utils/propTypes";
import Home from "../Home";
import baseStyles from '../Home.module.css'
import styles from './Create.module.css'
import { BiArrowBack } from 'react-icons/bi'

export default function Create(props: AuthProp) {
    const nav = useNavigate()
    return (
        <Home className={styles.container}>

            <BiArrowBack className={styles.backButton} onClick={() => {

                nav(`/`, { replace: true }) 

            }}/>

            <input type="text" id="usernameInput-Create" className={baseStyles.textInput} placeholder="Username" />

            <Button className={styles.submitButton} text={"Create Game"} onClick={async () => {
                
                const username = document.getElementById("usernameInput-Create") as HTMLTextAreaElement
                                
                const result = await props.requests.createLobby(username.value).catch((err) => { throw err; })

                if (result) {
                    
                    // Redirect user to lobby
                    nav(`/lobby/${result}`, { replace: true, state: [ username.value ] })

                    // Mark user as owner to prompt settings and start game pathways
                    sessionStorage.setItem("isOwner", "true")
                }

            }}/>

        </Home>
    )
}