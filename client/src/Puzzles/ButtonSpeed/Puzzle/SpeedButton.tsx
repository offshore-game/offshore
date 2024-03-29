import { useEffect, useRef, useState } from "react"
import { zoneNames } from "../../../API/requests"
import styles from './ButtonSpeed.module.css'
import buttonTypes from './ButtonTypes.module.css'

const sleep = async (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export default function SpeedButton(props: { index: number, zoneName: zoneNames, inactive?: boolean, timings: number[], poisonTimings: number[], timeToHit: number, timeouts: React.MutableRefObject<any[]>, endGameEvent: Event }) {
    
    const button = useRef(undefined as any) as React.MutableRefObject<HTMLDivElement>
    const [ isPoison, setIsPoison ] = useState(false)

    const [ clickUpSound, setClickUpSound ] = useState(undefined as any as HTMLAudioElement)
    const [ clickDownSound, setClickDownSound ] = useState(undefined as any as HTMLAudioElement)
    const [ lightUpSound, setLightUpSound ] = useState(undefined as any as HTMLAudioElement)

    const resetGame = async (poison?: boolean) => {
        // signal to the main component to reset the buttons
        document.dispatchEvent(props.endGameEvent)

        // Choose the animation
        if (poison) {
            
            // do a little animation
            button.current.className = buttonTypes.poison
            await sleep(500)
            button.current.className = buttonTypes.invalid
            await sleep(500)
            button.current.className = buttonTypes.poison
            await sleep(500)
            button.current.className = buttonTypes.invalid
            await sleep(500)

        } else {

            // standard fail animation
            button.current.className = buttonTypes.invalid

        }

    }

    useEffect(() => {

        let timeouts: any[] = []
        for (const timing of props.timings) {

            const changeAtTime = setTimeout(() => {

                // Change color time
                button.current.className = buttonTypes.active
                lightUpSound.play()

                const expiration = setTimeout(() => {

                    if (button.current.className == buttonTypes.button) {

                        // Pressed, all good

                    }

                    if (button.current.className == buttonTypes.active) {

                        // Not pressed, missed
                        
                        // Reset the game
                        return resetGame(false);

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
                lightUpSound.play()

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

        const resetCallback = () => {

            if (!button.current) return; // Error Supression

            // Reset color on a reset request
            button.current.className = buttonTypes.inactive

        }

        document.addEventListener('onBtnSpeedReset', resetCallback)

        // Load the click sounds
        setClickUpSound(new Audio('/Sounds/mouse up.mp3'))
        setClickDownSound(new Audio('/Sounds/mouse down.mp3'))

        // Load the "light up" sound
        setLightUpSound(new Audio('/Sounds/game ball tap.mp3'))

        return () => {

            document.removeEventListener('onBtnSpeedReset', resetCallback)

        }

    }, [])

    return (
        <div id={`speedBtn${props.index}`} ref={button} className={props.inactive ? buttonTypes.inactive : buttonTypes.button} onMouseDown={() => { if (!props.inactive) clickDownSound.play() }} onMouseUp={() => { if (!props.inactive) clickUpSound.play() }} onClick={async () => {
            
            if (props.inactive) return; // inactive button

            const currentClass = button.current.className

            if (currentClass == buttonTypes.button || currentClass == "") { // default value is ""

                // Dormant button; invalid
                return resetGame(false);

            }

            
            // (Don't care if it's Red) \\


            if (currentClass == buttonTypes.active) {

                // Poison button; invalid
                if (isPoison) {

                    // Reset the game
                    return resetGame(true);
                    
                }

                // Standard Button; return gray
                button.current.className = buttonTypes.button

            }

        }}/>

    )

}
