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

        // If there's an active wire
        if (connectionPoint.current && props.activeWireInfo) {

            const leftOffset = connectionPoint.current.offsetLeft
            const topOffset = connectionPoint.current.offsetTop
            const targetBase = document.getElementById(`wireTarget${props.count}`)!.getBoundingClientRect()

            // If no wire is currently connected
            if (!connectedWireOriginIndex) {

                console.log('firing event to connect the active wire from', props.activeWireInfo.originIndex)

                const connectWireEvent = new CustomEvent('connectActiveWire', {
                    detail: {
                        originIndex: props.activeWireInfo?.originIndex,
                        target: { x: (leftOffset + (targetBase.width / 4)), y: (topOffset + (targetBase.height / 4)) },
                    }
                })
        
                document.dispatchEvent(connectWireEvent)
                setConnectedWireOriginIndex(props.activeWireInfo?.originIndex)
    
                const newConnectedWireOrder = props.connectedWireOrder
                    newConnectedWireOrder[props.activeWireInfo?.originIndex!] = props.count
                props.setConnectedWireOrder(newConnectedWireOrder)

            }

        }

    }, [props.activeWireInfo, connectionPoint])


    const clickEvent = useCallback(() => {
        console.log("clicked with connected wire from", connectedWireOriginIndex) // not updating
        /*
            On mouse click on:
                - Signal to any wire that is
                    1) Active
                    2) Connected to THIS target
            to disconnect and follow the mouse
        */
        const disconnectWireEvent = new CustomEvent('disconnectWire', { // Send to Wire.tsx
            detail: {
                originIndex: connectedWireOriginIndex,
            }
        })

        document.dispatchEvent(disconnectWireEvent)
        setConnectedWireOriginIndex(undefined)

        const newConnectedWireOrder = props.connectedWireOrder
            delete newConnectedWireOrder[props.activeWireInfo?.originIndex!]
        props.setConnectedWireOrder(newConnectedWireOrder)

    }, [connectedWireOriginIndex, connectionPoint])


    // Event Listeners
    useEffect(() => {

        connectionPoint.current.addEventListener("mouseover", hoverEvent)
        connectionPoint.current.addEventListener("mousedown", clickEvent)

        // We actually don't need to destroy them, they're destroyed when the element is deleted. \\

    }, [])


    return (

        <div ref={container} className={styles.container}>
            <div className={styles.targetBase} id={`wireTarget${props.count}`}>

                <div ref={connectionPoint} className={styles.wireTarget}/>

            </div>
        </div>

    )

}
