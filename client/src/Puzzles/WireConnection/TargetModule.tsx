import React, { useEffect, useRef } from 'react'
import styles from './TargetModule.module.css'

export default function TargetModule(props: { count: number, activeWire: React.Component }) {

    const container = useRef(undefined as any) as React.MutableRefObject<HTMLDivElement>;
    const connectionPoint = useRef(undefined as any) as React.MutableRefObject<HTMLDivElement>;

    useEffect(() => {

        container.current.addEventListener("mouseover", () => {
            
            // on mouse over, link the wire to here.
            
            
            console.log(props.activeWire) // why is this undefined?


        })

    }, [])

    return (

        <div ref={container} className={styles.container}>
            <div className={styles.targetBase} id={`wireTarget${props.count}`}>

                <div ref={connectionPoint} className={styles.wireTarget}/>

            </div>
        </div>

    )

}
