import styles from './Entry.module.css'

export default function Entry(props: { username: string, coins: number, isPlayer?: boolean }) {

    return (
        <div className={props.isPlayer ? styles.currentPlayerContainer : styles.container}>

            {props.username}: {props.coins}

        </div>
    )

}