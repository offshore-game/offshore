import { useEffect, useState } from 'react'
import styles from './ButtonSpeedManual.module.css'

type solutionType = { fragments: number[] }

export default function ButtonSpeedManual(props: { layout: { rows: number, columns: number }, solution: solutionType, totalFragments: number }) {

    const [ buttonElems, setButtonElems ] = useState([] as any[])

    useEffect(() => {

        // set the layout for the display
        const root = document.querySelector(':root')! as HTMLElement
        root.style.setProperty('--buttonSpeed-Rows', `${props.layout.rows}`)
        root.style.setProperty('--buttonSpeed-Columns', `${props.layout.columns}`)

        for (let i = 0; i < (props.layout.rows * props.layout.columns); i++) { // WARNING: Internally base 0

            setButtonElems(entries => [...entries, <div className={styles.buttonWrapper}><div key={i} className={styles.button}>{props.solution.fragments.includes(i) ? "!!" : "" }</div></div>])
            
        }
        
    }, [])

    return (

        <div className={styles.container}>

            <div className={styles.buttonContainer}>
                <div className={styles.buttonGrid}>
                            
                    { buttonElems }
                    
                </div>
            </div>

            <div className={styles.instructions}>

                <span>Avoid <span style={{ fontWeight: 700 }}>!!</span></span>
                <span>Don't close the puzzle while doing it!</span>
                <br/>
                <span>Fragment 1 of {props.totalFragments}</span>

            </div>



        </div>

    )

}
