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

    poisonTiming: {
        [key: string]: number[]
    }

    gameDuration: number,

    timeToHit: number,

}


export default function ButtonSpeed(props: { layout: { rows: number, columns: number } }) {

    const [ buttonsInfo, setButtonsInfo ] = useState([] as any[])

    const [ buttonsPayload, setButtonsPayload ] = useState(undefined as any)
    
    const [ resetTrigger, setResetTrigger ] = useState(false)
    const reset = new Event('onBtnSpeedReset')

    const timeouts = useRef([] as any[])

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
                1: [ 3, 6, 11 ],
                2: [ 3, 6, 9 ],
                3: [ 6, 9, 12 ],
                4: [ 6, 9, 12 ],
                10: [ 2, 5, 15 ],
            },

            poisonTiming: { // If a button is poison, it CANNOT be a normal button as well.

                5: [ 7 ]

            },
    
            gameDuration: 15, // The time the game goes on
    
            timeToHit: 2, // NOTE: At minimum there must be a 1 second buffer + timeToHit between buttons lighting up
    
        }

        const tempInfo = []
        for (let i = 0; i < totalCount; i++) {

            // Push the data for each button (index and timing)

            tempInfo.push({
                index: i,
                timings: buttonSpeedPayload.timing[i] ? buttonSpeedPayload.timing[i] : [],
                poisonTimings: buttonSpeedPayload.poisonTiming[i] ? buttonSpeedPayload.poisonTiming[i]: [],
                timeToHit: buttonSpeedPayload.timeToHit
            })

        }
        

        // Wait for the game to end, then send a true response to the server
        const gameEndTimeout = setTimeout(() => {

            console.warn("Game Finished!")

        }, buttonSpeedPayload.gameDuration + 1 * 10000)

        setButtonsInfo(tempInfo) // Reset the state
        setButtonsPayload(buttonSpeedPayload) // Share the payload
        timeouts.current = [...timeouts.current, gameEndTimeout]

    }, []) // you get the payload once


    // Game needs to reset/setup
    useEffect(() => {

        /* 
            1) Destroy all timers
            2) Remake all buttons
                - Remakes timers too
        */

        if (resetTrigger) { // Don't double fire

            for (const timeout of timeouts.current) {

                // Destroy each timer
                clearTimeout(timeout)
    
            }
    
            setTimeout(() => {
                
                // Tell the buttons to reset
        
                document.dispatchEvent(reset)

                // Wait for the game to finish (again)
                const gameEndTimeout = setTimeout(() => {

                    console.warn("Game Finished (remake!")

                }, buttonsPayload.gameDuration + 1 * 10000)

                console.log('trigger change')
                setResetTrigger(false) // Toggle the trigger
                timeouts.current = [...timeouts.current, gameEndTimeout]


            }, 2000) // Wait two seconds before resetting

        }

        
    }, [resetTrigger])

    return (
        <div className={styles.container}>

            <div ref={buttonGrid} className={styles.buttonContainer}>
                
                {buttonsInfo.map((info) => <SpeedButton key={info.index} /*????*/ index={info.index} timings={ info.timings } poisonTimings={ info.poisonTimings } timeToHit={info.timeToHit} reset={setResetTrigger} resetEvent={reset} timeouts={timeouts} />)}

            </div>
            
        </div>
    )

}