import { useEffect, useRef, useState } from "react"
import styles from './ButtonSpeed.module.css'
import buttonTypes from './ButtonTypes.module.css'

const sleep = async (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export default function SpeedButton(props: { index: number, inactive?: boolean, timings: number[], poisonTimings: number[], timeToHit: number, reset: React.Dispatch<boolean>, timeouts: React.MutableRefObject<any[]>, resetEvent: Event }) {
    
    const button = useRef(undefined as any) as React.MutableRefObject<HTMLDivElement>
    const [ isPoison, setIsPoison ] = useState(false)

    useEffect(() => {

        let timeouts: any[] = []
        for (const timing of props.timings) {

            const changeAtTime = setTimeout(() => {

                // Change color time
                button.current.className = buttonTypes.active

                const expiration = setTimeout(() => {

                    if (button.current.className == buttonTypes.button) {

                        // Pressed, all good

                    }

                    if (button.current.className == buttonTypes.active) {

                        // Not pressed, missed
                        button.current.className = buttonTypes.invalid

                        // Reset the game
                        return props.reset(true);

                    }

                }, props.timeToHit * 1000)

                timeouts.push(expiration)

            }, timing * 1000 /* S --> MS */)

            timeouts.push(changeAtTime)

        }

        for (const poisonTiming of props.poisonTimings) {

            const changeAtTime = setTimeout(() => {

                // Change color time
                button.current.className = buttonTypes.active

                // Change state to poison
                setIsPoison(true)

                const expiration = setTimeout(() => {

                    /*if (button.current.style.backgroundColor == "gray") {

                        // Pressed, all good

                    }*/

                    if (button.current.className == buttonTypes.active) {

                        // Is poison, so miss is good.
                        button.current.className = buttonTypes.button


                    }

                }, props.timeToHit * 1000)

                timeouts.push(expiration)

            }, poisonTiming * 1000 /* S --> MS */)

            timeouts.push(changeAtTime)

        }

        props.timeouts.current = [...props.timeouts.current, ...timeouts]

    }) /* 
        This is fine because we already reset all timeouts when 
        the buttons request a reset, which is the only time the button reloads anyways.
    */

    useEffect(() => {

        document.addEventListener('onBtnSpeedReset', () => {

            if (!button.current) return; // Error Supression

            // Reset color on a reset request
            button.current.className = buttonTypes.button

        })

    }, [])


    return (
        <div id={`speedBtn${props.index}`} ref={button} className={props.inactive ? buttonTypes.inactive : buttonTypes.button} onClick={async () => {
            
            if (props.inactive) return; // inactive button

            const currentClass = button.current.className
            console.log("button's class:", currentClass)

            if (currentClass == buttonTypes.button || currentClass == "") { // default value is ""

                // Dormant button; invalid
                button.current.className = buttonTypes.invalid
                return props.reset(true);

            }

            
            // (Don't care if it's Red) \\


            if (currentClass == buttonTypes.active) {

                // Poison button; invalid
                if (isPoison) {

                    // Reset the game
                    props.reset(true);

                    // do a little animation
                    button.current.className = buttonTypes.poison
                    await sleep(500)
                    button.current.className = buttonTypes.invalid
                    await sleep(500)
                    button.current.className = buttonTypes.poison
                    await sleep(500)
                    button.current.className = buttonTypes.invalid
                    await sleep(500)

                    return;
                    
                }

                // return gray
                button.current.className = buttonTypes.button

            }

        }}/>

    )

}
