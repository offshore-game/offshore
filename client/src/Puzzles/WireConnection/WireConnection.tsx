import React, { useEffect, createContext, useState, useCallback } from 'react'
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

export type connectedIndexesType = {

    // Target Index: Wire's Origin Index
    [key: number]: number

}

export default function WireConnection(props: { count: number }) {

    const [activeWireInfo, setActiveWireInfo] = useState(undefined as activeWireInfoType)

    const [ connectedWireOrder, setConnectedWireOrder ] = useState({} as connectedWireOrderType)

    const [ connectedIndexes, setConnectedIndexes ] = useState({} as connectedIndexesType)



    function handleConnectedIndexes(targetIndex: number, wireOriginIndex: number | undefined) {

        if (!wireOriginIndex) {

            const payload = connectedIndexes
                delete payload[targetIndex]
        
            return setConnectedIndexes(payload);

        }

        
        const payload = connectedIndexes
            payload[targetIndex] = wireOriginIndex
        
        setConnectedIndexes(payload)

    }







    // DEBUG: not changing
    useEffect(() => { console.log("connectedIndexes:", connectedIndexes) }, [ connectedIndexes ])

    useEffect(() => { console.log('payload val', connectedWireOrder) }, [ connectedWireOrder ])














    // Send this payload to the server when ALL wires are connected (when there are props.count entries i guess)
    //console.log(connectedWireOrder)

    useEffect(() => { console.log(activeWireInfo) }, [activeWireInfo])

    const wireSourceElements = []
    const wireTargetElements = []
    for (let i = 0; i < props.count; i++) {
        //console.log('elems remade with activeWireInfo', activeWireInfo)

        const time = new Date().getTime() // (im lazy)
        
        wireSourceElements.push(<OriginModule count={i} setActiveWireInfo={setActiveWireInfo}/>)

        // NOTE: Keys help React know what changed and how to reload the element.

        wireTargetElements.push(<TargetModule key={`TargetModule${i}-${time}`} count={i} activeWireInfo={activeWireInfo} connectedWireOrder={connectedWireOrder} connectedWireIndex={connectedIndexes[i]} setConnectedWireOrder={setConnectedWireOrder} setConnectedWireIndexes={handleConnectedIndexes}/>)


    }

    return (
        <div id="WireGame-Container" className={styles.container}>

            <div className={styles.targetDisplayContainer}>{ wireSourceElements }</div>

            <div style={{marginTop: "20%"}} className={styles.targetDisplayContainer}>{ wireTargetElements }</div>
            
        </div>
    )

}