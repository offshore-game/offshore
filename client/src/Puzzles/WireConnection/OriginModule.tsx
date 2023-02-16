import React, { useState, useEffect, useRef, useContext } from 'react'
import styles from './OriginModule.module.css'
import Wire from './Wire';
import { activeWireInfoType } from './WireConnection';

export default function OriginModule(props: { count: number, setActiveWireInfo: React.Dispatch<activeWireInfoType> }) {

    const [activeWireElement, setActiveWireElement] = useState(undefined as any);

    const [activeWirePayload, setActiveWirePayload] = useState(undefined as any);

    const originPoint = useRef(undefined as any) as React.MutableRefObject<HTMLDivElement>;

    useEffect(() => {
    
        props.setActiveWireInfo(activeWirePayload)

    }, [activeWirePayload])

    return (
        <div className={styles.wireOriginContainer} onMouseDown={() => {

            console.log("mouse down on origin point")

            const leftOffset = originPoint.current.offsetLeft
            const topOffset = originPoint.current.offsetTop

            const wireBase = document.getElementById(`wireBase${props.count}`)!.getBoundingClientRect()
            const parentElem = document.getElementById("sizingWindow")!

            setActiveWireElement(<Wire originCoordinate={{ x: (leftOffset + (wireBase.width / 4)), y: (topOffset + (wireBase.height / 4)) }} offset={parentElem.getBoundingClientRect()} positioning={{x: wireBase.width / 4, y: wireBase.height / 4}} setActiveWirePayload={setActiveWirePayload}/>) // Don't ask why dividing by four works, I don't know.

            document.addEventListener("mouseup", (event) => { setActiveWireElement(undefined); setActiveWirePayload(undefined) }) // Destroy the wire elements when the mouse is released.

        }}>

            <div id={`wireBase${props.count}`} className={styles.wireBase}> 
            
                <div ref={originPoint} className={styles.wireOrigin}>{ activeWireElement }</div>

            </div>

            

        </div>
    )

}