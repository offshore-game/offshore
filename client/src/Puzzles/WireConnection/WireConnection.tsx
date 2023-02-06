import React, { useEffect, useRef, useState } from 'react'
import styles from './WireConnection.module.css'

export default function WireConnection(props: { count: number }) {

    const [wireElems, setwireElems] = useState([] as any[])
    const [targetElems, setTargetElems] = useState([] as any[])

    useEffect(() => {
        setwireElems([]) // Prevent a duplication bug on component reset.
        setTargetElems([])

        for (let i = 0; i < props.count; i++) {

            setwireElems(entries => [...entries, 
                
                <div className={styles.wireOriginContainer}>

                    <div id={`wireBase${i}`} className={styles.wireBase}> 
                    
                        <div className={styles.wireOrigin}/>

                    </div>

                    

                </div>

            ])

            setTargetElems(entries => [...entries, <div className={styles.wireBase}>

                { /* This is where the wires are connected */}

                1

            </div>])
        }
    }, [])

    return (
        <div className={styles.container}>

            <div className={styles.targetDisplayContainer}>{ wireElems }</div>

            <div style={{marginTop: "20%"}} className={styles.targetDisplayContainer}>{targetElems}</div>
            
        </div>
    )

}