import { useEffect, useState } from 'react'
import styles from './HealthBar.module.css'

export default function HealthBar(props: { percentage: number }) {

    const [ health, setHealth ] = useState(props.percentage)

    useEffect(() => {
        
        document.addEventListener("healthChange", (event: any) => {

            setHealth(event.detail.newHealth)

        })

    }, [])

    return (
        <div className={styles.base}>

            <div className={styles.green} style={{width: `${health}%`}}> 
            
                

            </div>
            <div className={styles.red} style={{width: `${health}%`}}/> {/* A shadow to show how much health is lost. */}
            

        </div>
    )

}