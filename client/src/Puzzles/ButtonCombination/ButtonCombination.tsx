import React, { useEffect, useState } from 'react'
import Button from '../../components/Button/Button'
import styles from './ButtonCombination.module.css'

export default function ButtonCombination(props: { count: number }) {

    const [buttonElems, setButtonElems] = useState([] as any[])

    useEffect(() => {
        setButtonElems([]) // Prevent a duplication bug on component reset.

        for (let i = 0; i <= props.count; i++) {
            setButtonElems(entries => [...entries, <div key={i} className={styles.button}>
                {/* Insert into here an up and down arrow that will change the .innerHTML property of the button */}
                ^{i}{">"}
            
            </div>])
        }
        console.log(buttonElems)
    }, [])

    return (
        <div className={styles.container}>

            <div className={styles.buttonContainer}>
                
                { buttonElems } { /* why no worky */ }

            </div>

            <Button text={"Submit"} onClick={() => {}} style={{margin: "15px", minHeight: "45px"}}/>
            
        </div>
    )

}