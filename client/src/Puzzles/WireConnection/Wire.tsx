import React, { useEffect, useRef } from 'react';
import styles from './Wire.module.css'
import { activeWireInfoType } from './WireConnection';

export default function Wire(props: { originCoordinate: { x: number, y: number }, endCoordinate?: { x: number, y: number }, positioning?: {x: any, y: any}, offset: DOMRect, setActiveWirePayload?: React.Dispatch<activeWireInfoType> }) {

    const wire = useRef(undefined as any) as React.MutableRefObject<HTMLDivElement>;

    useEffect(() => {

        function getParams(pointOne: { x: number, y: number }, pointTwo: { x: number, y: number }) {

            const slope = ((pointTwo.y - props.originCoordinate.y) / (pointTwo.x - props.originCoordinate.x))
            const distance = Math.sqrt(Math.pow((pointTwo.x - pointOne.x), 2) + Math.pow((pointTwo.y - pointOne.y), 2))
            let degree = Math.atan(slope) * (180 / Math.PI)

            if (degree < 0) {

                degree = Math.abs(degree + 180)

            }
    
            return {
                distance: distance,
                degree: degree,
            }

        }

        function mouseMoveListener(mouseEvent: MouseEvent) {
            const offsetMouseCoords = { x: mouseEvent.x - props.offset.left, y: mouseEvent.y - props.offset.top }
    
            const params = getParams(props.originCoordinate, offsetMouseCoords)

            const element = wire.current
                element.style.left = `${props.positioning!.x}px`
                element.style.top = `${props.positioning!.y}px`

                element.style.width = `${params.distance}px`
                element.style.transform = `rotate(${params.degree}deg)`
                element.style.height = "1px"
        }

        // No End Coordinate Defined, track mouse

        if (!props.endCoordinate && props.setActiveWirePayload) {
            const container = document.getElementById("WireGame-Container")!
            //const container = document.getElementById("sizingWindow")! // idk
            
            container.addEventListener("mousemove", mouseMoveListener)

            // Share information with the rest of the module
            props.setActiveWirePayload({
                color: wire.current.style.backgroundColor,
                origin: props.originCoordinate,
            })

        } else {

            // End Coordinate Defined

        }

        // On unmount
        return () => {

            const container = document.getElementById("WireGame-Container")!
            container.removeEventListener("mousemove", mouseMoveListener)

        }
        
    }, [])

    return (
        <div ref={wire} className={styles.wire}/>
    )

}