import React, { useEffect, useState } from 'react'
import { zoneNames } from '../../../API/requests'
import Button from '../../../components/Button/Button'
import { AuthProp } from '../../../utils/propTypes'
import styles from './ButtonCombinationPuzzle.module.css'
import CombinationButton from './CombinationButton'

export default function ButtonCombinationPuzzle(props: { count: number, zoneName: zoneNames } & AuthProp) {

    const [buttonElems, setButtonElems] = useState([] as any[])
    const [combinationPayload, setCombinationPayload] = useState({} as { [key: number]: number /* Order the button was pressed in: index of the button pressed */ })

    useEffect(() => {
        setButtonElems([]) // Prevent a duplication bug on component reset.

        for (let i = 0; i < props.count; i++) { // WARNING: Internally base 0
            setButtonElems(entries => [ ...entries, <CombinationButton key={i} index={i} combinationPayload={combinationPayload} setCombinationPayload={setCombinationPayload}/> ])
        }
    }, [combinationPayload])

    return (
        <div className={styles.container}>

            <div className={styles.buttonContainer}>
                
                { buttonElems }

            </div>

            <div className={styles.controlContainer}>

                <Button className={styles.controlButton} text={"Submit"} onClick={async () => {

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

                }} style={{minHeight: "25px"}}/>

                <Button className={styles.controlButton} text={"Restart"} onClick={() => {

                    setCombinationPayload({})

                }} style={{minHeight: "25px"}}/>

            </div>

            
        </div>
    )

}
