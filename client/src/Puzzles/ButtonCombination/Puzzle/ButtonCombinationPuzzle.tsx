import React, { useEffect, useState } from 'react'
import { zoneNames } from '../../../API/requests'
import Button from '../../../components/Button/Button'
import { AuthProp } from '../../../utils/propTypes'
import styles from './ButtonCombinationPuzzle.module.css'

export default function ButtonCombinationPuzzle(props: { count: number, zoneName: zoneNames } & AuthProp) {

    const [buttonElems, setButtonElems] = useState([] as any[])
    const [combinationPayload, setCombinationPayload] = useState({} as { [key: number]: number /* Order the button was pressed in: index of the button pressed */ })

    useEffect(() => {
        setButtonElems([]) // Prevent a duplication bug on component reset.

        for (let i = 0; i < props.count; i++) { // WARNING: Internally base 0
            setButtonElems(entries => [...entries, <div key={i} className={styles.button} onClick={() => {

                    const keys = []
                    
                    for (const key of Object.keys(combinationPayload)) {

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
                    
                    combinationPayload[`${nextKey}`] = i

                }}>{i+1}</div> // WARNING: Externally (Visually) base 1
            
            ])
        }
    }, [combinationPayload])

    return (
        <div className={styles.container}>

            <div className={styles.buttonContainer}>
                
                { buttonElems }

            </div>

            <Button text={"Submit"} onClick={async () => {

                const result = await props.requests.sendAnswer(props.zoneName, "buttonCombination", combinationPayload)

                // Reset the game if it's answered incorrectly
                if (!result) setCombinationPayload({})

                // Tell the game component the result
                const resultEvent = new CustomEvent("puzzleResult", {
                    detail: {
                        zoneName: props.zoneName,
                        result: result
                    }
                })
                document.dispatchEvent(resultEvent)



                console.log(combinationPayload)

            }} style={{margin: "4vh", minHeight: "45px"}}/>

            <Button text={"Restart"} onClick={() => {

                setCombinationPayload({})

            }} style={{margin: "4vh", minHeight: "45px"}}/>
            
        </div>
    )

}
