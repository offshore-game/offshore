import Entry from './Entry/Entry'
import styles from './Leaderboard.module.css'
import { useEffect, useState } from 'react'
import Button from '../Button/Button'
import { useNavigate } from 'react-router-dom'
import { BsHouseDoorFill } from 'react-icons/bs'

export default function Leaderboard(props: { leaderboard: { username: string, coins: number }[] }) {

    const nav = useNavigate()
    
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

        <div className={styles.container}>

            <span className={styles.header}>Leaderboard</span>
            <div className={styles.entries}>

                { sortedLeaderboard.map(player => <Entry username={player.username} coins={player.coins} isPlayer={ currentUsername == player.username }/>) }

            </div>

            <Button className={styles.homeButton} text={<BsHouseDoorFill />} onClick={() => {

                // Navigate Home
                nav('/', { replace: true })
                nav(0)

            }}/>
            
        </div>

    )

}