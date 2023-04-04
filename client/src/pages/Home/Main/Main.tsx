import React from "react";
import { redirect, useNavigate } from "react-router-dom";
import Button from "../../../components/Button/Button";
import Home from "../Home";
import styles from './Main.module.css'
import { ReactComponent as RedRaft } from '../../../assets/Home/Red Raft.svg'
import { ReactComponent as BlueRaft } from '../../../assets/Home/Blue Raft.svg'

export default function Main() {
    const nav = useNavigate()
    /*return (
        <Home>
            <Button className={styles.create} text={"Create"} onClick={() => {
                return nav('/create')
            }}/>

            <Button className={styles.join} text={"Join"} onClick={() => {
                return nav('/join')
            }}/>

            <Button className={styles.howToPlay} text={"How To Play"} onClick={() => {
                return nav('/tutorial')
            }}/>
        </Home>
    )*/
    return (
        <Home className={styles.container}>
            
            <div className={styles.raftWrapper}>
                <RedRaft className={styles.raft}/>
                <span className={styles.text}>Raft!</span>
            </div>

            <div className={styles.raftWrapper}>
                <RedRaft className={styles.raft}/>
                <span className={styles.text}>Raft!</span>
            </div>

        </Home>
    )
}
