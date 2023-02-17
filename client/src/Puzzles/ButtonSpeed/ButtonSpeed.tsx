import React, { useEffect, useRef, useState } from 'react'
import styles from './ButtonSpeed.module.css'

export default function ButtonSpeed(props: { layout: { rows: number, columns: number } }) {

    const [ buttons, setButtons ] = useState([] as any[])
    const buttonGrid = useRef(undefined as any) as React.MutableRefObject<HTMLDivElement>

    type buttonSpeedPayloadType = {
        
        layout: {
            rows: number,
            columns: number,
        },

        timing: {
            [key: string]: number[]
        }

    }

    let buttonSpeedPayload: buttonSpeedPayloadType = {

        layout: props.layout,

        timing: {
            0: [ 2, 5, 10 ], // At 2, 5, and 10 seconds after start
            1: [ 3, 6, 11 ]
        }

    }

    /*
    
    How it works:
    - Timestamps are given as the distance from the start count to the end count
    - Client is responsible for reporting this back truthfully (i dont feel like programming delay counter)

    */


    // Render all the buttons
    useEffect(() => {

        const buttonCount = props.layout.rows * props.layout.columns

        for (let i = 0; i < buttonCount; i++) {

            setButtons(entries => [...entries, <div key={`buttonSpeed-${i}`} id={`buttonSpeed-${i}`} className={styles.button}>{i}</div>])

        }

        const root = document.querySelector(':root')! as HTMLElement
        root.style.setProperty('--buttonSpeed-Rows', `${props.layout.rows}`)
        root.style.setProperty('--buttonSpeed-Columns', `${props.layout.columns}`)


    }, [])

    useEffect(() => {

        // Lifecycle for the random buttons
        const startTimestampSec = new Date().getTime() * 1000 // Milliseconds to Seconds

        for (const [button, times] of Object.entries(buttonSpeedPayload.timing)) {
            console.log('1')
            for (const time of times) {
                // For each time
                

                setTimeout(() => {
                    console.log('timeout run')

                    const element = document.getElementById(`buttonSpeed-${button}`)
                    console.log(element)
                    element?.style.setProperty('background-color', 'red') // not working bruh

                    setTimeout(() => {

                        // Return to gray after x amount of time
                        element?.style.setProperty('background-color', 'gray')

                    }, 2000 /* 2 seconds */)

                }, time * 1000 /* In milliseconds */)

            }

        }

        
    }, [])

    return (
        <div className={styles.container}>

            <div ref={buttonGrid} className={styles.buttonContainer}>
                
                { buttons }

            </div>
            
        </div>
    )

}