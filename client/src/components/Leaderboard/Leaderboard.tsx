import Entry from './Entry/Entry'
import styles from './Leaderboard.module.css'
import { ReactComponent as SolverBackground} from '../../assets/Game/SolverBackground.svg'
import { ReactComponent as Water} from '../../assets/Game/Water.svg'
import React, { useEffect, useState } from 'react'

export default function Leaderboard(props: { leaderboard: { username: string, coins: number }[] }) {

    const currentUsername = sessionStorage.getItem("username")
    const [ sortedLeaderboard, setSortedLeaderboard ] = useState([] as { username: string, coins: number }[])

    useEffect(() => {

        const newLeaderboard = [...props.leaderboard]

        // Sort the leaderboard
        newLeaderboard.sort((a, b) => {

            return b.coins - a.coins

        })

        setSortedLeaderboard(newLeaderboard)

    }, [])

    return (
        <React.Fragment>
            <SolverBackground className={styles.background}/>
            <Water className={styles.background}/>

            <div className={styles.container}>

                <span className={styles.header}>Leaderboard</span>
                <div className={styles.entries}>

                    { sortedLeaderboard.map(player => <Entry username={player.username} coins={player.coins} isPlayer={ currentUsername == player.username }/>) }

                </div>
                
            </div>
        </React.Fragment>

    )

}