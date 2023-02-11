import React, { useEffect, useRef, useState } from 'react'
import OriginModule from './OriginModule'
import styles from './WireConnection.module.css'

export default function WireConnection(props: { count: number }) {

    const [wireSourceElems, setWireSourceElems] = useState([] as any[])
    const [wireTargetElems, setWireTargetElems] = useState([] as any[])

    useEffect(() => {
        setWireSourceElems([]) // Prevent a duplication bug on component reset.
        setWireTargetElems([])

        for (let i = 0; i < props.count; i++) {

            setWireSourceElems(entries => [...entries, 
                
                <OriginModule count={i}/>

            ])

            setWireTargetElems(entries => [...entries, <div className={styles.wireBase}>

                { /* This is where the wires are connected */}

                1

            </div>])
        }
    }, [])

    return (
        <div id="WireGame-Container" className={styles.container}>

            <div className={styles.targetDisplayContainer}>{ wireSourceElems }</div>

            <div style={{marginTop: "20%"}} className={styles.targetDisplayContainer}>{ wireTargetElems }</div>
            
        </div>
    )

}