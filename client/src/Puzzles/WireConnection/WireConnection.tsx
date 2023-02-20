import React, { useEffect, createContext, useState } from 'react'
import OriginModule from './OriginModule'
import TargetModule from './TargetModule'
import styles from './WireConnection.module.css'

type coordinate = { x: number, y: number }
export type activeWireInfoType = { color: string, origin: coordinate } | undefined
type connectedWiresType = Array<activeWireInfoType>


export default function WireConnection(props: { count: number }) {

    const [activeWireInfo, setActiveWireInfo] = useState(undefined as activeWireInfoType)


    const wireSourceElements = []
    const wireTargetElements = []
    for (let i = 0; i < props.count; i++) {

        wireSourceElements.push(<OriginModule count={i} setActiveWireInfo={setActiveWireInfo}/>)

        wireTargetElements.push(<TargetModule key={`TargetModule${i}`} count={i} activeWireInfo={activeWireInfo}/>)

    }

    return (
        <div id="WireGame-Container" className={styles.container}>

            <div className={styles.targetDisplayContainer}>{ wireSourceElements }</div>

            <div style={{marginTop: "20%"}} className={styles.targetDisplayContainer}>{ wireTargetElements }</div>
            
        </div>
    )

}