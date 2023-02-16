import React, { useEffect, useRef, useState } from 'react'
import styles from './TargetModule.module.css'
import { activeWireInfoType } from './WireConnection';

export default function TargetModule(props: { count: number, activeWireInfo: activeWireInfoType, connectedWireInfo: activeWireInfoType }) {

    const container = useRef(undefined as any) as React.MutableRefObject<HTMLDivElement>;
    const connectionPoint = useRef(undefined as any) as React.MutableRefObject<HTMLDivElement>;

    useEffect(() => {console.log("hi")}, [props.activeWireInfo])

    useEffect(() => {

        container.current.addEventListener("mouseover", () => {
            
            /* 
            On mouse over:
            - Access the active wire
                - Get the color
                - Get the origin
            - Create a new wire
                - Share origin
                - Share Color
                - Set Endpoint
            */

            // https://jsramblings.com/are-you-logging-the-state-immediately-after-updating-it-heres-why-that-doesnt-work/
            console.log(props.activeWireInfo) // doesn't update because setState() is asynchronous
 
        })

    }, [])

    return (

        <div ref={container} className={styles.container}>
            <div className={styles.targetBase} id={`wireTarget${props.count}`}>

                <div ref={connectionPoint} className={styles.wireTarget}/>
                { JSON.stringify(props.activeWireInfo) }

            </div>
        </div>

    )

}
