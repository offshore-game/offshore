import React, { useEffect, createContext, useState } from 'react'
import OriginModule from './OriginModule'
import TargetModule from './TargetModule'
import styles from './WireConnection.module.css'

type coordinate = { x: number, y: number }
export type activeWireInfoType = { color: string, origin: coordinate } | undefined
type connectedWiresType = Array<activeWireInfoType>


export default function WireConnection(props: { count: number }) {

    const [wireSourceElems, setWireSourceElems] = useState([] as any[])
    const [wireTargetElems, setWireTargetElems] = useState([] as any[])

    const [activeWireInfo, setActiveWireInfo] = useState(undefined as activeWireInfoType)
    const [connectedWires, setConnectedWires] = useState([] as connectedWiresType);

    function createActiveWire(origin: coordinate, offset: DOMRect, ) {


        
    }

    useEffect(() => {
        setWireSourceElems([]) // Prevent a duplication bug on component reset.
        setWireTargetElems([])

        if (activeWireInfo) {
            console.log('active wire info changed:', activeWireInfo) // state change firing here just fine
        }

        for (let i = 0; i < props.count; i++) {
            console.log('new elements being made')
            
            setWireSourceElems(entries => [...entries, 
                
                <OriginModule count={i} setActiveWireInfo={setActiveWireInfo}/>

            ])

            const connectedWire = connectedWires[i] // Prevent any previously set wires from being reset

            setWireTargetElems(entries => [...entries, 
                
                /* this is where the wires are connected*/
                
                <TargetModule key={`TargetModule${i}`} count={i} activeWireInfo={activeWireInfo} connectedWireInfo={connectedWire}/>

            ])
        }
    }, [activeWireInfo])

    // Event Listener
    useEffect(() => {



    }, [])

    /*useEffect(() => {

        if (activeWireInfo) {
            console.log('active wire info changed:', activeWireInfo) // state change firing here just fine
        }

    }, [activeWireInfo])*/

    return (
        <div id="WireGame-Container" className={styles.container}>

            <div className={styles.targetDisplayContainer}>{ wireSourceElems }</div>

            <div style={{marginTop: "20%"}} className={styles.targetDisplayContainer}>{ wireTargetElems }</div>
            
        </div>
    )

}