import React, { useEffect, useRef } from 'react'
import styles from './TargetModule.module.css'
import { activeWireInfoType } from './WireConnection';

export default function TargetModule(props: { count: number, activeWireInfo: activeWireInfoType }) {

    const container = useRef(undefined as any) as React.MutableRefObject<HTMLDivElement>;
    const connectionPoint = useRef(undefined as any) as React.MutableRefObject<HTMLDivElement>;

    useEffect(() => {console.log("hi")}, [props.activeWireInfo])

    useEffect(() => {

        container.current.addEventListener("mouseover", () => {
            
            /* 
            On mouse over:
            - Access the active wire
                - Get the color
                - Get the origin
            - Create a new wire
                - Share origin
                - Share Color
                - Set Endpoint
            */
            /*console.log('hover')
            console.log("out:", JSON.stringify(props.activeWireInfo))
            if (props.activeWireInfo) {
                console.log(JSON.stringify(props.activeWireInfo)) // Chrome you're funny.
            }*/
            
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
