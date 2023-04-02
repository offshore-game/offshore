import { useEffect, useState } from 'react'
import { AuthProp } from '../../utils/propTypes'
import { AiOutlineHeart } from 'react-icons/ai'
import styles from './HealthBar.module.css'

export default function HealthBar(props: { percentage: number } & AuthProp) {

    const [ health, setHealth ] = useState(props.percentage)

    const [ errorSound, setErrorSound ] = useState(undefined as any as HTMLAudioElement)
    useEffect(() => {

        // Load the error sound
        setErrorSound(new Audio('/Sounds/game show wrong answer buzz.mp3'))

    }, [])


    useEffect(() => {
        
        props.requests.socket.on("healthChange", (payload: { health: number }) => {
            
            // Play an error sound to everyone
            errorSound.play()

            setHealth(health < 0 ? 0 : payload.health)

        })

        return () => {

            props.requests.socket.off("healthChange")

        }

    })

    return (
        <div className={styles.base}>

            <AiOutlineHeart className={styles.heart}/>

            <div className={styles.green} style={{width: `${health}%`}}> 
            
                

            </div>
            <div className={styles.red} style={{width: `${health}%`}}/> {/* A shadow to show how much health is lost. */}
            

        </div>
    )

}