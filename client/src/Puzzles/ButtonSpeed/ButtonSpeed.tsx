import React, { useEffect, useRef, useState } from 'react'
import styles from './ButtonSpeed.module.css'
import SpeedButton from './SpeedButton'

type buttonSpeedPayloadType = {
        
    layout: {
        rows: number,
        columns: number,
    },

    timing: {
        [key: string]: number[]
    },

    gameDuration: number,

    timeToHit: number,

}

// https://stackoverflow.com/questions/66431691/dynamically-rendering-an-array-of-components

/*
- Async the data object
- Set as state and re-render
- Use https://www.youtube.com/watch?v=f640Z6QZawc to create components based off said data object
*/

export default function ButtonSpeed(props: { layout: { rows: number, columns: number } }) {

    const [ buttonsInfo, setButtonsInfo ] = useState([] as any[])
    const [ resetTrigger, setResetTrigger ] = useState(false)
    const buttonGrid = useRef(undefined as any) as React.MutableRefObject<HTMLDivElement>

    /*
    
    How it works:
    - Timestamps are given as the distance from the start count to the end count
    - Client is responsible for reporting this back truthfully (i dont feel like programming delay counter)

    */

    useEffect(() => {

        const totalCount = props.layout.rows * props.layout.columns

        const root = document.querySelector(':root')! as HTMLElement
        root.style.setProperty('--buttonSpeed-Rows', `${props.layout.rows}`)
        root.style.setProperty('--buttonSpeed-Columns', `${props.layout.columns}`)

        const buttonSpeedPayload: buttonSpeedPayloadType = {

            layout: props.layout,
    
            timing: {
                0: [ 2, 5, 10 ], // At 2, 5, and 10 seconds after start
                1: [ 3, 6, 11 ]
            },
    
            gameDuration: 13, // The time the game goes on
    
            timeToHit: 2,
    
        }

        const tempInfo = []
        for (let i = 0; i < totalCount; i++) {

            // Push the data for each button (index and timing)

            tempInfo.push({
                index: i,
                timings: buttonSpeedPayload.timing[i],
                timeToHit: buttonSpeedPayload.timeToHit
            })

        }
        
        setButtonsInfo(tempInfo) // Reset the state

    }, []) // you get the payload once

    return (
        <div className={styles.container}>

            <div ref={buttonGrid} className={styles.buttonContainer}>
                
                {buttonsInfo.map((info) => <SpeedButton index={info.index} timings={ info.timings }/>)}

            </div>
            
        </div>
    )

}