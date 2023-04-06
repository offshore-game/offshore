import styles from './PlayerEntry.module.css'
import { ReactComponent as Plank } from '../../../../assets/Home/Plank.svg';

export default function PlayerEntry(props: { username: string, isPlayer?: boolean }) {

    return (
        <div className={props.isPlayer ? styles.currentPlayerContainer : styles.container}>
            { props.username }
        </div>
    )

}