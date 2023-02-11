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

            const wireBase = document.getElementById(`wireBase${props.count}`)!.getBoundingClientRect()

            //const parentElem = document.getElementById("WireGame-Container")! // DEBUG: this has to be the whole screen bud
            const parentElem = document.getElementById("sizingWindow")!
            
            // setActiveWireElements(<Wire originCoordinate={{ x: (leftOffset + 20), y: (topOffset) }} offset={parentElem.getBoundingClientRect()}  testInput={20}/>)
            // MODEL POSITIONING BASED OFF OF THIS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

            setActiveWireElements(<Wire originCoordinate={{ x: (leftOffset + (wireBase.width / 4)), y: (topOffset + (wireBase.height / 4)) }} offset={parentElem.getBoundingClientRect()}  testInput={{x: wireBase.width / 4, y: wireBase.height / 4}}/>) // Don't ask why dividing by four works, I don't know.

            document.addEventListener("mouseup", (event) => { setActiveWireElements(undefined) })

        }}>

            <div id={`wireBase${props.count}`} className={styles.wireBase}> 
            
                <div ref={originPoint} className={styles.wireOrigin}>{ activeWireElements }</div>

            </div>

            

        </div>
    )

}