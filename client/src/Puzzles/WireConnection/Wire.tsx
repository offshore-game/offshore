import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Wire.module.css'
import { activeWireInfoType } from './WireConnection';

export default function Wire(props: { originIndex: number, originCoordinate: { x: number, y: number }, endCoordinate?: { x: number, y: number }, positioning?: {x: any, y: any}, offset: DOMRect, setActiveWirePayload: React.Dispatch<activeWireInfoType>, selfContainer: React.Dispatch<any> }) {

    const wire = useRef(undefined as any) as React.MutableRefObject<HTMLDivElement>;
    const [ endCoordinate, setEndCoordinate ] = useState(props.endCoordinate ? props.endCoordinate : undefined)

    const onConnectActiveWire = useCallback((event: CustomEvent) => {

        const originIndex = props.originIndex

        /*console.log('origin index:', originIndex)
        console.log('requested origin index:', event.detail.originIndex)*/
        
        if (originIndex == event.detail.originIndex) {

            console.log("connecting active wire") // DEBUG: this is firing twice
            // this module is very confused on what an "active wire" is

            setEndCoordinate(event.detail.target);

        }

    }, [])

    const disconnectWire = useCallback((event: CustomEvent) => {

        const originIndex = props.originCoordinate

        console.log(event.detail.origin)
        
        if (originIndex == event.detail.originIndex) {

            console.log("setting undefined")
            setEndCoordinate(undefined);

        }

    }, [])


    useEffect(() => {console.log("endCoordinate:", endCoordinate)}, [endCoordinate])




    const destroySelf = useCallback(() => {

        props.selfContainer(undefined)
        props.setActiveWirePayload(undefined)

    }, [])

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

        if (!endCoordinate && props.setActiveWirePayload) {

            console.log("tracking mouse, no end coordinate defined") // DEBUG: why is this not firing?

            const container = document.getElementById("WireGame-Container")!
            
            container.addEventListener("mousemove", mouseMoveListener)

            // Destroy the wire elements when the mouse is released.
            document.addEventListener("mouseup", destroySelf) 

            // Share information with the rest of the module
            props.setActiveWirePayload({
                color: wire.current.style.backgroundColor,
                origin: props.originCoordinate,
                originIndex: props.originIndex
            })

        } else if (endCoordinate) {

            // End Coordinate Defined
            const params = getParams(props.originCoordinate, endCoordinate)

            const element = wire.current
                element.style.left = `${props.positioning!.x}px`
                element.style.top = `${props.positioning!.y}px`

                element.style.width = `${params.distance}px`
                element.style.transform = `rotate(${params.degree}deg)`
                element.style.height = "1px"

            // Don't destroy the wire when the mouse is released
            document.removeEventListener("mouseup", destroySelf)

            // No longer active wire
            props.setActiveWirePayload(undefined)
        }

        // Event listener for connecting the wire on hover
        document.addEventListener("connectActiveWire", onConnectActiveWire as any)

        // Event listener for disconnecting the wire
        document.addEventListener("disconnectWire", disconnectWire as any)
        
        // On unmount
        return () => {

            const container = document.getElementById("WireGame-Container")!
            

            // Destroy the event listeners
            container.removeEventListener("mousemove", mouseMoveListener)
            document.removeEventListener("connectActiveWire", onConnectActiveWire as any)
            document.removeEventListener("mouseup", destroySelf)
            document.removeEventListener("disconnectWire", disconnectWire as any)

        }
        
    }, [endCoordinate])

    return (
        <div ref={wire} className={styles.wire}/>
    )

}