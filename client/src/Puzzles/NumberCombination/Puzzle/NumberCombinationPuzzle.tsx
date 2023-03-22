import React, { useEffect, useState } from 'react'
import { RxTriangleUp, RxTriangleDown } from 'react-icons/rx'
import { zoneNames } from '../../../API/requests'
import Button from '../../../components/Button/Button'
import { AuthProp } from '../../../utils/propTypes'
import styles from './NumberCombinationPuzzle.module.css'

export default function NumberCombinationPuzzle(props: { count: number, zoneName: zoneNames } & AuthProp) {

    const [numberElems, setNumberElems] = useState([] as any[])

    useEffect(() => {
        setNumberElems([]) // Prevent a duplication bug on component reset.

        for (let i = 0; i < props.count; i++) {
            setNumberElems(entries => [...entries,
            
                <div key={i} className={styles.button}>
                    <RxTriangleUp className={styles.arrow} onClick={() => {

                        // Add one to the number (cap 9)
                        const element = document.getElementById(`buttonVal${i}`)!
                        const numVal = Number(element.innerHTML)
                        if (numVal < 9) {
                            element.innerHTML = `${numVal + 1}`
                        }

                    }}/>

                    <div id={`buttonVal${i}`}>0</div>

                    <RxTriangleDown className={styles.arrow} onClick={() => {

                        // Remove one from the number (floor 0)
                        const element = document.getElementById(`buttonVal${i}`)!
                        const numVal = Number(element.innerHTML)
                        if (numVal > 0) {
                            element.innerHTML = `${numVal - 1}`
                        }
                        

                    }}/>
                
                </div>
            
            ])
        }
    }, [])

    return (
        <div className={styles.container}>

            <div className={styles.buttonContainer}>
                
                { numberElems }

            </div>

            <Button className={styles.submit} text={`Submit`} onClick={async () => {

                const combinationPayload: { [key: string]: number } = {}

                for (let i = 0; i < numberElems.length; i++) {

                    const element = document.getElementById(`buttonVal${i}`)!
                    combinationPayload[i] = +element.innerHTML

                }

                // API Call
                const result = await props.requests.sendAnswer(props.zoneName, "numberCombination", combinationPayload)
                
                // Tell the game component the result
                const resultEvent = new CustomEvent("puzzleResult", {
                    detail: {
                        zoneName: props.zoneName,
                        result: result
                    }
                })
                document.dispatchEvent(resultEvent)
                

            }} style={{margin: "4vh", minHeight: "45px"}}/>
            
        </div>
    )

}
