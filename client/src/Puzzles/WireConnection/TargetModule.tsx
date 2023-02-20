import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from './TargetModule.module.css'
import Wire from './Wire';
import { activeWireInfoType } from './WireConnection';

export default function TargetModule(props: { count: number, activeWireInfo: activeWireInfoType }) {

    const container = useRef(undefined as any) as React.MutableRefObject<HTMLDivElement>;
    const connectionPoint = useRef(undefined as any) as React.MutableRefObject<HTMLDivElement>;

    console.log("REMOUNT: ", props.activeWireInfo!)

    const hoverEvent = useCallback(() => {

        if (connectionPoint.current) {

            const leftOffset = connectionPoint.current.offsetLeft
            const topOffset = connectionPoint.current.offsetTop
            const targetBase = document.getElementById(`wireTarget${props.count}`)!.getBoundingClientRect()

            const connectWireEvent = new CustomEvent('connectActiveWire', {
                detail: {
                    origin: props.activeWireInfo?.origin,
                    target: { x: (leftOffset + (targetBase.width / 4)), y: (topOffset + (targetBase.height / 4)) }, // DEBUG: bad data yk
                }
            })
    
            document.dispatchEvent(connectWireEvent)

        }



        /* 
            On mouse over:
            - Signal the active wire to connect

            On mouse DRAG out:
            - Signal to any wire that is
                1) Active
                2) Connected to THIS target
            to disconnect and follow the mouse
        */

    }, [props.activeWireInfo])

    useEffect(() => {
        console.log("AWI:", props.activeWireInfo)
        if (!props.activeWireInfo) {

            connectionPoint.current.removeEventListener("mouseover", hoverEvent) // Destroy the event listener when there is no active wire (bug issues)
        
        } else {
            
            connectionPoint.current.addEventListener("mouseover", hoverEvent)
        
        }
        
    }, [props.activeWireInfo]) // This is going to cause a lot of problems down the line, creating new listeners every new wire without destroying it (ok we destroy it)

    return (

        <div ref={container} className={styles.container}>
            <div className={styles.targetBase} id={`wireTarget${props.count}`}>

                <div ref={connectionPoint} className={styles.wireTarget}/>

            </div>
        </div>

    )

}
