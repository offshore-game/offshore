import Entry from './Entry/Entry'
import styles from './Leaderboard.module.css'
import { ReactComponent as SolverBackground} from '../../assets/Game/SolverBackground.svg'
import { ReactComponent as Water} from '../../assets/Game/Water.svg'
import React from 'react'

export default function Leaderboard(props: { leaderboard: { username: string, coins: number }[] }) {

    const currentUsername = localStorage.getItem("username")

    return (
        <React.Fragment>
            <SolverBackground className={styles.background}/>
            <Water className={styles.background}/>

            <div className={styles.container}>

                <span className={styles.header}>LEADERBOARD</span>
                <div className={styles.entries}>

                    { props.leaderboard.map(player => <Entry username={player.username} coins={player.coins} isPlayer={ currentUsername == player.username }/>) }

                </div>
                
            </div>
        </React.Fragment>

    )

}