import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from './TargetModule.module.css'
import Wire from './Wire';
import { activeWireInfoType } from './WireConnection';

export default function TargetModule(props: { count: number, activeWireInfo: activeWireInfoType }) {

    const container = useRef(undefined as any) as React.MutableRefObject<HTMLDivElement>;
    const connectionPoint = useRef(undefined as any) as React.MutableRefObject<HTMLDivElement>;

    const [ connectedWireOriginPoint, setConnectedWireOriginPoint ] = useState({ x: 0, y: 0 } as any)

    const hoverEvent = useCallback(() => {
        
        /* 
            On mouse over:
            - Signal the active wire to connect
        */

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
            setConnectedWireOriginPoint(props.activeWireInfo?.origin)

        }

    }, [props.activeWireInfo])

    const dragEvent = useCallback(() => {
        console.log('mouse down')
        /*
            On mouse DRAG out:
                - Signal to any wire that is
                    1) Active
                    2) Connected to THIS target
            to disconnect and follow the mouse
        */
        const disconnectWireEvent = new CustomEvent('disconnectWire', {
            detail: {
                origin: connectedWireOriginPoint,
            }
        })

        document.dispatchEvent(disconnectWireEvent)

    }, [connectedWireOriginPoint])

    useEffect(() => {

        if (!props.activeWireInfo) {

            connectionPoint.current.removeEventListener("mouseover", hoverEvent) // Destroy the event listener when there is no active wire (prevents bugs)
            connectionPoint.current.removeEventListener("mousedown", dragEvent)
        
        } else {
            
            connectionPoint.current.addEventListener("mouseover", hoverEvent)
            connectionPoint.current.addEventListener("mousedown", dragEvent)
        
        }
        
    }, [props.activeWireInfo, connectedWireOriginPoint]) // This is going to cause a lot of problems down the line if listeners aren't destroyed (they are)

    return (

        <div ref={container} className={styles.container}>
            <div className={styles.targetBase} id={`wireTarget${props.count}`}>

                <div ref={connectionPoint} className={styles.wireTarget}/>

            </div>
        </div>

    )

}
