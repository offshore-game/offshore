import React, { useEffect, useRef, useState } from 'react'
import styles from './ButtonSpeed.module.css'

export default function ButtonSpeed(props: { layout: { rows: number, columns: number } }) {

    const [ buttons, setButtons ] = useState([] as any[])

    const [ resetTrigger, setResetTrigger ] = useState(false)

    const buttonGrid = useRef(undefined as any) as React.MutableRefObject<HTMLDivElement>

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

    let buttonSpeedPayload: buttonSpeedPayloadType = {

        layout: props.layout,

        timing: {
            0: [ 2, 5, 10 ], // At 2, 5, and 10 seconds after start
            1: [ 3, 6, 11 ]
        },

        gameDuration: 13, // The time the game goes on

        timeToHit: 2,

    }

    /*
    
    How it works:
    - Timestamps are given as the distance from the start count to the end count
    - Client is responsible for reporting this back truthfully (i dont feel like programming delay counter)

    */


    // Render all the buttons
    useEffect(() => {
        setButtons([])

        const buttonCount = props.layout.rows * props.layout.columns

        for (let i = 0; i < buttonCount; i++) {

            setButtons(entries => [...entries, <div key={`buttonSpeed-${i}`} id={`buttonSpeed-${i}`} className={styles.button}>{i}</div>])

        }

        const root = document.querySelector(':root')! as HTMLElement
        root.style.setProperty('--buttonSpeed-Rows', `${props.layout.rows}`)
        root.style.setProperty('--buttonSpeed-Columns', `${props.layout.columns}`)


    }, [resetTrigger])

    useEffect(() => {

        // Lifecycle for the random buttons
        const timeouts: any = []

        for (const [button, times] of Object.entries(buttonSpeedPayload.timing)) {
            for (const time of times) {
                // For each time
                

                let mainTimeout = setTimeout(() => {
                    const element = document.getElementById(`buttonSpeed-${button}`)
                    
                    element?.style.setProperty('background-color', 'blue') // not working bruh

                    // TO-DO:
                    // Listen for a click, if the click does not come within x amount of time, trigger a reset

                    let pass = false

                    element?.addEventListener("mousedown", () => {

                        pass = true // Player clicked button

                        element?.style.setProperty('background-color', 'gray')

                    })


                    // Listen for if the player clicked or not
                    let expirationTimeout = setTimeout(() => {

                        if (!pass) {

                            // Player failed
                            console.log("fail!")
                            for (const timeout of timeouts) { console.log('kill timeout'); clearTimeout(timeout) }

                            //for (const btn of buttons) { console.log(btn); btn.style.setProperty('background-color', 'gray') } // DEBUG: why no worky

                            setResetTrigger(resetTrigger ? false : true) // Toggle the trigger

                        }

                        // Return to gray after x amount of time
                        element?.style.setProperty('background-color', 'gray')

                    }, buttonSpeedPayload.timeToHit * 1000 /* time alloted to click the button */)

                    timeouts.push(expirationTimeout)

                }, time * 1000 /* In milliseconds */)

                timeouts.push(mainTimeout)

            }

        }

        let gameEndTimeout = setTimeout(() => {

            console.log("game over!")

        }, buttonSpeedPayload.gameDuration * 1000 /* Finish the game after this time */)

        timeouts.push(gameEndTimeout)
        
    }, [resetTrigger])

    useEffect(() => { console.log('trigger changed')}, [resetTrigger])

    return (
        <div className={styles.container}>

            <div ref={buttonGrid} className={styles.buttonContainer}>
                
                { buttons }

            </div>
            
        </div>
    )

}