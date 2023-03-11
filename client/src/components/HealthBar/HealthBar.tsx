import { useEffect, useState } from 'react'
import { AuthProp } from '../../utils/propTypes'
import styles from './HealthBar.module.css'

export default function HealthBar(props: { percentage: number } & AuthProp) {

    const [ health, setHealth ] = useState(props.percentage)

    useEffect(() => {
        
        props.requests.socket.on("healthChange", (payload: { health: number }) => {
            
            setHealth(health < 0 ? 0 : payload.health)

        })

        return () => {

            props.requests.socket.off("healthChange")

        }

    })

    return (
        <div className={styles.base}>

            <div className={styles.green} style={{width: `${health}%`}}> 
            
                

            </div>
            <div className={styles.red} style={{width: `${health}%`}}/> {/* A shadow to show how much health is lost. */}
            

        </div>
    )

}