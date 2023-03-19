import React, { useEffect, useRef, useState } from 'react'
import { PuzzleInfo } from '../../API/requests'
import Button from '../../components/Button/Button'
import styles from './ButtonSpeed.module.css'
import SpeedButton from './SpeedButton'

export default function ButtonSpeed(props: { layout: { rows: number, columns: number }, timings: PuzzleInfo["buttonGridTimings"] }) {

    console.log(props)

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

        const root = document.querySelector(':root')! as HTMLElement
        root.style.setProperty('--buttonSpeed-Rows', `${props.layout.rows}`)
        root.style.setProperty('--buttonSpeed-Columns', `${props.layout.columns}`)

        const totalCount = props.layout.rows * props.layout.columns

        // Visual display
        const tempInfo = []
        for (let i = 0; i < totalCount; i++) {

            // Push the (empty//visual) data for each button
            tempInfo.push({
                index: i,
                timings: [],
                poisonTimings: [],
                timeToHit: props.timings!.timeToHit,
                inactive: true
            })

        }
        
        setButtonsInfo(tempInfo) // Display the state

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

                }, (props.timings!.duration + 1) * 1000)

                console.log('trigger change')
                setResetTrigger(false) // Toggle the trigger
                timeouts.current.push(gameEndTimeout)


            }, 2000) // Wait two seconds before resetting

        }

        
    }, [resetTrigger])

    return (
        <div className={styles.container}>

            <div ref={buttonGrid} className={styles.buttonContainer}>
                
                {buttonsInfo.map((info) => <SpeedButton key={info.index} inactive={info.inactive} index={info.index} timings={ info.timings } poisonTimings={ info.poisonTimings } timeToHit={info.timeToHit} reset={setResetTrigger} resetEvent={reset} timeouts={timeouts} />)}

            </div>

            <Button text="Start" onClick={() => {
                
                const totalCount = props.layout.rows * props.layout.columns

                // Start the game!
                const tempInfo = []
                for (let i = 0; i < totalCount; i++) {
        
                    // Push the data for each button (index and timing)
        
                    tempInfo.push({
                        index: i,
                        timings: props.timings!.standard[i] ? props.timings!.standard[i] : [],
                        poisonTimings: props.timings!.poison[i] ? props.timings!.poison[i]: [],
                        timeToHit: props.timings!.timeToHit
                    })
        
                }
        
                if (!buttonsInfo[0].inactive) return; // prevent a bug with spamming start
        

                // Wait for the game to end, then send a true response to the server
                const gameEndTimeout = setTimeout(() => {
                    
                    console.warn("Game Finished!")
        
                }, (props.timings!.duration + 1) * 1000)

                
                setButtonsInfo(tempInfo) // Reset the state
                setButtonsPayload(props.timings) // Share the payload
                timeouts.current.push(gameEndTimeout)

            }}/>
            
        </div>
    )

}
