import Entry from './Entry/Entry'
import styles from './Leaderboard.module.css'

export default function Leaderboard(props: { leaderboard: { username: string, coins: number }[] }) {

    const currentUsername = localStorage.getItem("username")

    for (const player of props.leaderboard) {



    }

    return (
        <div className={styles.container}>
            LEADERBOARD
            <div className={styles.entries}>

                { props.leaderboard.map(player => <Entry username={player.username} coins={player.coins} isPlayer={ currentUsername == player.username }/>) }

            </div>
            
        </div>
    )

}