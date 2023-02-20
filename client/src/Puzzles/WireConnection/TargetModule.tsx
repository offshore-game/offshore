import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from './TargetModule.module.css'
import Wire from './Wire';
import { activeWireInfoType, connectedWireOrderType } from './WireConnection';

export default function TargetModule(props: { count: number, activeWireInfo: activeWireInfoType, connectedWireOrder: connectedWireOrderType, setConnectedWireOrder: React.Dispatch<React.SetStateAction<connectedWireOrderType>> }) {

    const container = useRef(undefined as any) as React.MutableRefObject<HTMLDivElement>;
    const connectionPoint = useRef(undefined as any) as React.MutableRefObject<HTMLDivElement>;

    const [ connectedWireOriginIndex, setConnectedWireOriginIndex ] = useState(undefined as any)

    const hoverEvent = useCallback(() => {
        
        /* 
            On mouse over:
            - Signal the active wire to connect
        */

        if (connectionPoint.current && props.activeWireInfo) {

            console.log("Target sees", props.activeWireInfo)

            const leftOffset = connectionPoint.current.offsetLeft
            const topOffset = connectionPoint.current.offsetTop
            const targetBase = document.getElementById(`wireTarget${props.count}`)!.getBoundingClientRect()

            // No wire is currently connected
            if (!connectedWireOriginIndex) {

                const connectWireEvent = new CustomEvent('connectActiveWire', {
                    detail: {
                        originIndex: props.activeWireInfo?.originIndex,
                        target: { x: (leftOffset + (targetBase.width / 4)), y: (topOffset + (targetBase.height / 4)) }, // DEBUG: bad data yk
                    }
                })
        
                document.dispatchEvent(connectWireEvent)
                setConnectedWireOriginIndex(props.activeWireInfo?.originIndex)
    
                const newConnectedWireOrder = props.connectedWireOrder
                    newConnectedWireOrder[props.activeWireInfo?.originIndex!] = props.count
                props.setConnectedWireOrder(newConnectedWireOrder)

            }

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
                originIndex: connectedWireOriginIndex,
            }
        })

        document.dispatchEvent(disconnectWireEvent)
        setConnectedWireOriginIndex(undefined)

        const newConnectedWireOrder = props.connectedWireOrder
            delete newConnectedWireOrder[props.activeWireInfo?.originIndex!]
        props.setConnectedWireOrder(newConnectedWireOrder)

    }, [connectedWireOriginIndex])

    useEffect(() => {

        if (!props.activeWireInfo) {

            connectionPoint.current.removeEventListener("mouseover", hoverEvent) // Destroy the event listener when there is no active wire (prevents bugs)
            connectionPoint.current.removeEventListener("mousedown", dragEvent)
        
        } else {
            
            connectionPoint.current.addEventListener("mouseover", hoverEvent)
            connectionPoint.current.addEventListener("mousedown", dragEvent)
        
        }
        
    }, [props.activeWireInfo, connectedWireOriginIndex]) // This is going to cause a lot of problems down the line if listeners aren't destroyed (they are)

    return (

        <div ref={container} className={styles.container}>
            <div className={styles.targetBase} id={`wireTarget${props.count}`}>

                <div ref={connectionPoint} className={styles.wireTarget}/>

            </div>
        </div>

    )

}
