import React from "react";
import { redirect, useNavigate } from "react-router-dom";
import Button from "../../../components/Button/Button";
import Home from "../Home";
import styles from './Main.module.css'
import { ReactComponent as RedRaft } from '../../../assets/Home/Red Raft.svg';
import { ReactComponent as BlueRaft } from '../../../assets/Home/Blue Raft.svg';
import { ReactComponent as Plank } from '../../../assets/Home/Plank.svg';

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
            
            <div className={styles.raftsContainer}>
                <div className={styles.raftWrapper} onClick={() => {

                    return nav('/join')

                }}>
                    <RedRaft className={styles.raft} style={{ rotate: "310deg" }}/>
                    <span className={styles.text}>Join</span>
                </div>

                <div className={styles.raftWrapper} onClick={() => {

                    return nav('/create')

                }}>
                    <BlueRaft className={styles.raft}/>
                    <span className={styles.text}>Create</span>
                </div>

            </div>
            
            <div className={styles.raftWrapper} style={{ width: "35%" }} onClick={() => {

                return nav('/tutorial')

            }}>
                <Plank />
                <span className={styles.text}>How to Play</span>
            </div>

        </Home>
    )
}
