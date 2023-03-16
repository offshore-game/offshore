import { useEffect, useState } from 'react'
import styles from './ButtonCombinationPuzzle.module.css'

type combinationPayloadType = { [key: number]: number /* Order the button was pressed in: index of the button pressed */ }

export default function CombinationButton(props: { index: number, combinationPayload: combinationPayloadType, setCombinationPayload: React.Dispatch<combinationPayloadType> }) {

    const [ clickable, setClickable ] = useState(true)

    useEffect(() => {

        const find = Object.entries(props.combinationPayload).find(entry => entry[1] == props.index)

        if (find) {
            
            setClickable(false)
        
        } else {

            setClickable(true)

        }

    })

    return (
        <div key={props.index} className={clickable ? styles.button : styles.inactiveButton} onClick={() => {

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

        }}>{props.index+1}</div> // WARNING: Externally (Visually) base 1
    )

}