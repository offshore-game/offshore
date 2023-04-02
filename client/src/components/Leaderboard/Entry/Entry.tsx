import styles from './Entry.module.css'
import { BiCoinStack } from 'react-icons/bi'

export default function Entry(props: { username: string, coins: number, isPlayer?: boolean }) {

    return (
        <div className={props.isPlayer ? styles.currentPlayerContainer : styles.container}>

            <span style={{ fontWeight: "500", marginRight: "1%" }}>{props.username}</span> | {props.coins} <BiCoinStack className={styles.coinIcon}/>

        </div>
    )

}

/*<div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", margin: "5%" }}>{props.username}</div> 
<div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", margin: "5%" }}>
    
    {props.coins}
</div>*/