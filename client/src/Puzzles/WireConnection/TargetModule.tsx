import React, { useEffect, useRef, useState } from 'react'
import styles from './TargetModule.module.css'
import { activeWireInfoType } from './WireConnection';

export default function TargetModule(props: { count: number, activeWireInfo: activeWireInfoType, connectedWireInfo: activeWireInfoType }) {

    const container = useRef(undefined as any) as React.MutableRefObject<HTMLDivElement>;
    const connectionPoint = useRef(undefined as any) as React.MutableRefObject<HTMLDivElement>;



    const hoverEvent = () => {

        console.log(props.activeWireInfo)

        

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

    }

    useEffect(() => {

        if (!props.activeWireInfo) {

            container.current.removeEventListener("mouseover", hoverEvent) // Destroy the event listener when there is no active wire (bug issues)
        
        } else {
            
            container.current.addEventListener("mouseover", hoverEvent)
        
        }
        
    }, [props.activeWireInfo]) // This is going to cause a lot of problems down the line, creating new listeners every new wire without destroying it (ok we destroy it)

    return (

        <div ref={container} className={styles.container}>
            <div className={styles.targetBase} id={`wireTarget${props.count}`}>

                <div ref={connectionPoint} className={styles.wireTarget}/>
                { JSON.stringify(props.activeWireInfo) }

            </div>
        </div>

    )

}
