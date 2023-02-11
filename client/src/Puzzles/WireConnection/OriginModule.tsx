import React, { useState, useEffect, useRef } from 'react'
import styles from './OriginModule.module.css'
import Wire from './Wire';

export default function OriginModule(props: { count: number }) {

    const [activeWireElements, setActiveWireElements] = useState(undefined as any);
    const originPoint = useRef(undefined as any) as React.MutableRefObject<HTMLDivElement>;

    useEffect(() => {

        

    }, [activeWireElements])

    return (
        <div className={styles.wireOriginContainer} onMouseDown={() => {

            console.log("mouse down on origin point")

            const leftOffset = originPoint.current.offsetLeft
            const topOffset = originPoint.current.offsetTop

            //const parentElem = document.getElementById("WireGame-Container")! // DEBUG: this has to be the whole screen bud
            const parentElem = document.getElementById("sizingWindow")!
            


            setActiveWireElements(<Wire originCoordinate={{ x: (leftOffset), y: (topOffset) }} offset={parentElem.getBoundingClientRect()}/>) // aight bruh WHAAAAAAAAAAAAAAAAT

            document.addEventListener("mouseup", (event) => { setActiveWireElements(undefined) })

        }}>

            <div id={`wireBase${props.count}`} className={styles.wireBase}> 
            
                <div ref={originPoint} className={styles.wireOrigin}>{ activeWireElements }</div>

            </div>

            

        </div>
    )

}