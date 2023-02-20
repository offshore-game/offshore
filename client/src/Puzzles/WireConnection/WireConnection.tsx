import React, { useEffect, createContext, useState } from 'react'
import OriginModule from './OriginModule'
import TargetModule from './TargetModule'
import styles from './WireConnection.module.css'

type coordinate = { x: number, y: number }
export type activeWireInfoType = { color: string, origin: coordinate, originIndex: number } | undefined
type connectedWiresType = Array<activeWireInfoType>

export type connectedWireOrderType = {

    // Origin Index: Target Index
    [key: number]: number

}

export default function WireConnection(props: { count: number }) {

    const [activeWireInfo, setActiveWireInfo] = useState(undefined as activeWireInfoType)

    const [ connectedWireOrder, setConnectedWireOrder ] = useState({} as connectedWireOrderType)

    // Send this payload to the server when ALL wires are connected (when there are props.count entries i guess)
    console.log(connectedWireOrder)

    const wireSourceElements = []
    const wireTargetElements = []
    for (let i = 0; i < props.count; i++) {

        wireSourceElements.push(<OriginModule count={i} setActiveWireInfo={setActiveWireInfo}/>)

        wireTargetElements.push(<TargetModule key={`TargetModule${i}`} count={i} activeWireInfo={activeWireInfo} connectedWireOrder={connectedWireOrder} setConnectedWireOrder={setConnectedWireOrder} />)

    }

    return (
        <div id="WireGame-Container" className={styles.container}>

            <div className={styles.targetDisplayContainer}>{ wireSourceElements }</div>

            <div style={{marginTop: "20%"}} className={styles.targetDisplayContainer}>{ wireTargetElements }</div>
            
        </div>
    )

}