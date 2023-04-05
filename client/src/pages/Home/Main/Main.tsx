import React, { useEffect, useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import Button from "../../../components/Button/Button";
import Home from "../Home";
import styles from './Main.module.css'
import { ReactComponent as RedRaft } from '../../../assets/Home/Red Raft.svg';
import { ReactComponent as BlueRaft } from '../../../assets/Home/Blue Raft.svg';
import { ReactComponent as Plank } from '../../../assets/Home/Plank.svg';

export default function Main() {

    const nav = useNavigate()
    const [ clickUpSound, setClickUpSound ] = useState(undefined as any as HTMLAudioElement)
    const [ clickDownSound, setClickDownSound ] = useState(undefined as any as HTMLAudioElement)

    // Asset Pre-Loader \\
    useEffect(() => {

        // Load the click sounds
        setClickUpSound(new Audio('/Sounds/mouse up.mp3'))
        setClickDownSound(new Audio('/Sounds/mouse down.mp3'))

    }, [])

    return (
        <Home className={styles.container}>
            
            <div className={styles.raftsContainer}>

                <div className={styles.raftWrapper} onMouseDown={() => { clickDownSound.play() }} onMouseUp={() => { clickUpSound.play() }} onClick={() => {

                    return nav('/join')

                }}>
                    <RedRaft className={styles.raft} style={{ rotate: "310deg" }}/>
                    <span className={styles.text}>Join</span>
                </div>

                <div className={styles.raftWrapper} onMouseDown={() => { clickDownSound.play() }} onMouseUp={() => { clickUpSound.play() }} onClick={() => {

                    return nav('/create')

                }}>
                    <BlueRaft className={styles.raft}/>
                    <span className={styles.text}>Create</span>
                </div>

            </div>
            
            <div className={styles.raftWrapper} onMouseDown={() => { clickDownSound.play() }} onMouseUp={() => { clickUpSound.play() }} style={{ width: "35%" }} onClick={() => {

                return nav('/tutorial')

            }}>
                <Plank className={styles.plank}/>
                <span className={styles.text}>How to Play</span>
            </div>

        </Home>
    )
}
