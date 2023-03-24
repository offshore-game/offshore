import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import Home from "../Home";
import styles from './Tutorial.module.css'

export default function Tutorial() {

    const nav = useNavigate();

    return (
        <Home>
            
            <BiArrowBack className={styles.backButton} onClick={() => {

                nav(`/`, { replace: true }) 

            }}/>

            <div className={styles.container}>
                
                <p>
                    Welcome to Offshore! This game is designed to challenge your communication,
                    problem solving, and time management skills.
                </p>
                
            </div>


        </Home>
    )

}
