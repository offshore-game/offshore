import React, { useEffect, useState } from 'react'
import { RxTriangleUp, RxTriangleDown } from 'react-icons/rx'
import Button from '../../components/Button/Button'
import styles from './ButtonCombination.module.css'

export default function ButtonCombination(props: { count: number }) {

    const [buttonElems, setButtonElems] = useState([] as any[])
    const [combinationPayload, setCombinationPayload] = useState([] as number[])

    useEffect(() => {
        setButtonElems([]) // Prevent a duplication bug on component reset.

        for (let i = 0; i <= props.count; i++) { // WARNING: Internally base 0
            setButtonElems(entries => [...entries, <div key={i} className={styles.button} onClick={() => {

                    setCombinationPayload(entries => [...entries, i]) // Add the button's key into the payload

                }}>{i+1}</div> // WARNING: Externally base 1
            
            ])
        }
    }, [])

    return (
        <div className={styles.container}>

            <div className={styles.buttonContainer}>
                
                { buttonElems }

            </div>

            <Button text={"Submit"} onClick={() => {

                // (FEATURE) Insert API Call here
                console.log(combinationPayload)

            }} style={{margin: "4vh", minHeight: "45px"}}/>

            <Button text={"Restart"} onClick={() => {

                setCombinationPayload([])

            }} style={{margin: "4vh", minHeight: "45px"}}/>
            
        </div>
    )

}
