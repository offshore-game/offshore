import React, { useEffect, useRef, useState } from 'react'
import { PuzzleInfo, zoneNames } from '../../../API/requests'
import Button from '../../../components/Button/Button'
import { AuthProp } from '../../../utils/propTypes'
import styles from './ButtonSpeed.module.css'
import SpeedButton from './SpeedButton'

export default function ButtonSpeed(props: { zoneName: zoneNames, layout: { rows: number, columns: number }, timings: PuzzleInfo["buttonGridTimings"] } & AuthProp) {

    const [ buttonsInfo, setButtonsInfo ] = useState([] as any[])

    const [ active, setActive ] = useState(false)
    
    const reset = new Event('onBtnSpeedReset')
    const endGame = new Event('endBtnSpeedGame')

    const timeouts = useRef([] as any[])

    const buttonGrid = useRef(undefined as any) as React.MutableRefObject<HTMLDivElement>

    /*
    
    How it works:
    - Timestamps are given as the distance from the start count to the end count
    - Client is responsible for reporting this back truthfully (i dont feel like programming delay counter)

    */

    // Init \\
    useEffect(() => {

        console.log('init')

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
                inactive: true,
            })

        }
        
        setButtonsInfo(tempInfo) // Display the state

    }, [])

    // Game Events \\
    useEffect(() => {

        // Prevent a False Pass (Bug Fix)
        const closedCallback = (event: any) => {
    
            const zoneName = event.detail.zoneName
            if (zoneName == props.zoneName) {

                // Kill all the timers
                for (const timeout of timeouts.current) {
                    // Destroy each timer
                    clearTimeout(timeout)
                }
                setActive(false);

            }
        }
        document.addEventListener("puzzleClosed", closedCallback)

        // Listen for end game requests
        const endCallback = (event: any) => {
            console.log('game end requested')

            // Handle resetting the game
            setActive(false);

        }
        document.addEventListener("endBtnSpeedGame", endCallback)

        // Destroy event listeners
        return () => {

            document.removeEventListener("puzzleClosed", closedCallback)
            document.removeEventListener("endBtnSpeedGame", endCallback)

        }

    }, [])


    // Trigger Watch \\
    useEffect(() => {

        // Destroy Timers Between States
        for (const timeout of timeouts.current) {

            // Destroy each timer
            clearTimeout(timeout)

        }

        console.log('active changed to', active)

        const root = document.querySelector(':root')! as HTMLElement
        root.style.setProperty('--buttonSpeed-Rows', `${props.layout.rows}`)
        root.style.setProperty('--buttonSpeed-Columns', `${props.layout.columns}`)

        // Game was told to start
        if (active) {

            // Add the buttons
            const totalCount = props.layout.rows * props.layout.columns
        
            // Visual display
            const tempInfo = []
            for (let i = 0; i < totalCount; i++) {
    
                // Push the active data for each button
                tempInfo.push({
                    index: i,
                    timings: props.timings?.standard[i] ? props.timings?.standard[i] : [],
                    poisonTimings: props.timings?.poison[i] ? props.timings?.poison[i] : [],
                    timeToHit: props.timings!.timeToHit,
                    inactive: false,
                })
    
            }
            
            setButtonsInfo(tempInfo) // Display the state

            // Wait for the game to finish (again)
            const gameEndTimeout = setTimeout(() => {

                props.requests.sendAnswer(props.zoneName, "buttonSpeed", true)
                const resultEvent = new CustomEvent("puzzleResult", {
                    detail: {
                        zoneName: props.zoneName,
                        result: true // Game success
                    }
                })
                document.dispatchEvent(resultEvent)

            }, (props.timings!.duration + 1 /* + 1 second buffer */) * 1000)
            timeouts.current.push(gameEndTimeout)


        }

        // Game was told to deactivate
        if (!active) {

            const deactivateTimeout = setTimeout(() => {

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
                        inactive: true,
                    })
        
                }
                
                setButtonsInfo(tempInfo) // Display the state

            }, 2000)
            timeouts.current.push(deactivateTimeout)

        }

    }, [active])

    return (
        <div className={styles.container}>
            
            <div className={styles.buttonContainer}>
                <div ref={buttonGrid} className={styles.buttonGrid}>
                    
                    {buttonsInfo.map((info) => <SpeedButton key={info.index} zoneName={props.zoneName} inactive={info.inactive} index={info.index} timings={ info.timings } poisonTimings={ info.poisonTimings } timeToHit={info.timeToHit} endGameEvent={endGame} timeouts={timeouts} />)}

                </div>
            </div>


            <div className={styles.controlContainer}>
                <Button className={styles.controlButton} text="Start" onClick={() => {
                    
                    // Unpressable while active
                    if (active) return;

                    // Activate the game
                    return setActive(true);

                }}/>
            </div>

            
        </div>
    )

}
