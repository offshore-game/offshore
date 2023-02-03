import React, { useEffect, useState } from 'react'
import { RxTriangleUp, RxTriangleDown } from 'react-icons/rx'
import Button from '../../components/Button/Button'
import styles from './NumberCombination.module.css'

export default function NumberCombination(props: { count: number }) {

    const [buttonElems, setButtonElems] = useState([] as any[])

    useEffect(() => {
        setButtonElems([]) // Prevent a duplication bug on component reset.

        for (let i = 0; i <= props.count; i++) {
            setButtonElems(entries => [...entries, <div key={i} className={styles.button}>
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
            
            </div>])
        }
    }, [])

    return (
        <div className={styles.container}>

            <div className={styles.buttonContainer}>
                
                { buttonElems }

            </div>

            <Button text={"Submit"} onClick={() => {

                const combinationPayload: { [key: number]: string } = {}

                for (let i = 0; i < buttonElems.length; i++) {

                    const element = document.getElementById(`buttonVal${i}`)!
                    combinationPayload[i] = element.innerHTML

                }

                // (FEATURE) Insert API Call here
                console.log(combinationPayload)

            }} style={{margin: "4vh", minHeight: "45px"}}/>
            
        </div>
    )

}