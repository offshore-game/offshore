import React, { useEffect, useRef, useState } from 'react'
import styles from './TargetModule.module.css'
import Wire from './Wire';
import { activeWireInfoType } from './WireConnection';

export default function TargetModule(props: { count: number, activeWireInfo: activeWireInfoType, connectedWireInfo: activeWireInfoType }) {

    const container = useRef(undefined as any) as React.MutableRefObject<HTMLDivElement>;
    const connectionPoint = useRef(undefined as any) as React.MutableRefObject<HTMLDivElement>;

    const [connectedWire, setConnectedWire] = useState(undefined as any)


    useEffect(() => { console.log(connectedWire) }, [ connectedWire ])

    const hoverEvent = () => {

        console.log(connectedWire)

        const endTarget = connectionPoint.current.getBoundingClientRect()

        const parentElem = document.getElementById("sizingWindow")!

        setConnectedWire(<Wire originCoordinate={props.activeWireInfo!.origin} endCoordinate={{ x: endTarget.x, y: endTarget.y }} offset={parentElem.getBoundingClientRect()}/>)

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
        console.log("AWI:", props.activeWireInfo)
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
                { connectedWire }

            </div>
        </div>

    )

}
