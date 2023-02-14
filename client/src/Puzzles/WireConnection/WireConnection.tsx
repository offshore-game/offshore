import React, { useEffect, createContext, useState } from 'react'
import OriginModule from './OriginModule'
import TargetModule from './TargetModule'
import styles from './WireConnection.module.css'

export type activeWireInfoType = { color: string, origin: { x: number, y: number } } | undefined


export default function WireConnection(props: { count: number }) {

    const [wireSourceElems, setWireSourceElems] = useState([] as any[])
    const [wireTargetElems, setWireTargetElems] = useState([] as any[])

    const [activeWireInfo, setActiveWireInfo] = useState(undefined as activeWireInfoType)

    useEffect(() => {
        setWireSourceElems([]) // Prevent a duplication bug on component reset.
        setWireTargetElems([])

        for (let i = 0; i < props.count; i++) {

            setWireSourceElems(entries => [...entries, 
                
                <OriginModule count={i} setActiveWireInfo={setActiveWireInfo}/>

            ])

            setWireTargetElems(entries => [...entries, 
                
                /* this is where the wires are connected*/
                
                <TargetModule key={`TargetModule${i}`} count={i} activeWireInfo={activeWireInfo} /> // goofball react is making this the default value on start and not changing it

            ])
        }
    }, [])

    useEffect(() => {

        if (activeWireInfo) {
            console.log('active wire info changed:', activeWireInfo) // state change firing here just fine
        }

    }, [activeWireInfo])

    return (
        <div id="WireGame-Container" className={styles.container}>

            <div className={styles.targetDisplayContainer}>{ wireSourceElems }</div>

            <div style={{marginTop: "20%"}} className={styles.targetDisplayContainer}>{ wireTargetElems }</div>
            
        </div>
    )

}