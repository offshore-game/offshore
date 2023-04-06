import { useEffect, useState } from 'react'
import styles from './Entry.module.css'
import { BiCoinStack } from 'react-icons/bi'

const sleep = async (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default function Entry(props: { username: string, coins: number, isPlayer?: boolean }) {

    const [ displayedCoins, setDisplayedCoins ] = useState(0)
    const [ countUpTimer, setCountUpTimer ] = useState(undefined as any)

    useEffect(() => {

        // Wait 6 seconds

        setTimeout(() => {

            setCountUpTimer(setInterval(() => {

                setDisplayedCoins(value => value + 1)
    
            }, 10))

        }, 6000)

    }, [])

    useEffect(() => {

        if (displayedCoins >= props.coins) {

            // Bug Fix
            setDisplayedCoins(props.coins)

            clearInterval(countUpTimer)
            setCountUpTimer(undefined)

        }

    }, [displayedCoins])

    return (
        <div className={props.isPlayer ? styles.currentPlayerContainer : styles.container}>

            <span style={{ fontWeight: "500", marginRight: "1%" }}>{props.username}</span> | {displayedCoins} <BiCoinStack className={styles.coinIcon}/>

        </div>
    )

}

/*<div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", margin: "5%" }}>{props.username}</div> 
<div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", margin: "5%" }}>
    
    {props.coins}
</div>*/