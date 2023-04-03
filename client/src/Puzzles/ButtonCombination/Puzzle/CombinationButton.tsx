import { useEffect, useRef, useState } from 'react'
import styles from './ButtonCombinationPuzzle.module.css'

type combinationPayloadType = { [key: number]: number /* Order the button was pressed in: index of the button pressed */ }

export default function CombinationButton(props: { index: number, combinationPayload: combinationPayloadType, setCombinationPayload: React.Dispatch<combinationPayloadType> }) {

    const [ clickable, setClickable ] = useState(true)

    const [ clickUpSound, setClickUpSound ] = useState(undefined as any as HTMLAudioElement)
    const [ clickDownSound, setClickDownSound ] = useState(undefined as any as HTMLAudioElement)

    // Asset Loader \\
    useEffect(() => {

        // Load the click sounds
        setClickUpSound(new Audio('/Sounds/mouse up.mp3'))
        setClickDownSound(new Audio('/Sounds/mouse down.mp3'))

    }, [])

    // Button Handler \\
    useEffect(() => {

        const find = Object.entries(props.combinationPayload).find(entry => entry[1] == props.index)

        if (find) {
            
            // Disable Button
            setClickable(false)
        
        } else {

            // Enable Button
            setClickable(true)
        }
        
        
    })

    return (
        <div key={props.index} className={clickable ? styles.button : styles.inactiveButton} onMouseDown={() => { if (clickable) clickDownSound.play() }} onMouseUp={() => { if (clickable) clickUpSound.play() }} onClick={() => {

            if (!clickable) return;

            const keys = []
            
            for (const key of Object.keys(props.combinationPayload)) {

                // some undefined
                if (!key) continue;

                keys.push(parseInt(key))

            }

            let nextKey
            if (keys.length > 0) {

                // Sort the array in order from least to greatest (i dont trust javascript)
                keys.sort((a, b) => {
                    return a - b;
                })

                nextKey = keys[keys.length - 1] + 1
                

            } else { // No other keys; first one

                nextKey = 0

            }
            
            props.combinationPayload[`${nextKey}`] = props.index

            setClickable(false)

        }}/> // WARNING: Externally (Visually) base 1
    )

}