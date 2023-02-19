import { useEffect, useRef, useState } from "react"
import styles from './ButtonSpeed.module.css'

export default function SpeedButton(props: { index: number, timings: number[], timeToHit: number, reset: React.Dispatch<boolean>, timeouts: React.MutableRefObject<any[]>, resetEvent: Event }) {
    
    const button = useRef(undefined as any) as React.MutableRefObject<HTMLDivElement>

    useEffect(() => {

        let timeouts: any[] = []
        for (const timing of props.timings) {

            const changeAtTime = setTimeout(() => {

                // Change color time
                button.current.style.backgroundColor = "blue"

                const expiration = setTimeout(() => {

                    if (button.current.style.backgroundColor == "gray") {

                        // Pressed, all good

                    }

                    if (button.current.style.backgroundColor == "blue") {

                        // Not pressed, missed
                        button.current.style.backgroundColor = "red"

                        // Reset the game
                        return props.reset(true);

                    }

                }, props.timeToHit * 1000)

                timeouts.push(expiration)

            }, timing * 1000 /* S --> MS */)

            timeouts.push(changeAtTime)

        }

        props.timeouts.current = [...props.timeouts.current, ...timeouts]

    }) /* 
        This is fine because we already reset all timeouts when 
        the buttons request a reset, which is the only time the button reloads anyways.
    */

    useEffect(() => {

        document.addEventListener('onBtnSpeedReset', () => {

            // Reset color on a reset request
            button.current.style.backgroundColor = "gray"

        })

    }, [])


    return (
        <div id={`speedBtn${props.index}`} ref={button} className={styles.button} onClick={() => {

            const color = button.current.style.backgroundColor
            console.log("button's self color:", color)

            if (color == "gray" || color == "") { // default value is ""

                // Inactive button; invalid
                button.current.style.backgroundColor = "red"
                return props.reset(true);

            }

            
            // Don't care if it's Red


            if (color == "blue") {

                // return gray
                button.current.style.backgroundColor = "gray"

            }

        }}>
            {props.index}
        </div>
    )

}