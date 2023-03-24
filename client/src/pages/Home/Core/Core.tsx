import React from "react";
import { redirect, useNavigate } from "react-router-dom";
import Button from "../../../components/Button/Button";
import Home from "../Home";
import styles from './Core.module.css'

export default function Core() {
    const nav = useNavigate()
    return (
        <Home>
            <Button className={styles.create} text={"Create"} onClick={() => {
                return nav('/create')
            }}/>

            <Button className={styles.join} text={"Join"} onClick={() => {
                return nav('/join')
            }}/>

            <Button className={styles.howToPlay} text={"How To Play"} onClick={() => {

            }}/>
        </Home>
    )
}