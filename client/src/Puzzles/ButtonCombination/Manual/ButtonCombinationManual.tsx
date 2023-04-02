import { useEffect, useState } from "react"
import styles from './ButtonCombinationManual.module.css'

type solutionType = { fragments: { buttonOrder: string, buttonIndex: number }[] }

export default function ButtonCombinationManual(props: { buttonCount: number, solution: solutionType }) {

    const [ buttonElems, setButtonElems ] = useState([] as any[])

    useEffect(() => {

        for (let i = 0; i < props.buttonCount; i++) { // WARNING: Internally base 0

            const indexFragment = props.solution.fragments.find(solution => solution.buttonIndex == i)

            setButtonElems(entries => [...entries, <div key={i} className={styles.button}>{indexFragment ? parseInt(indexFragment.buttonOrder) + 1 : "?"}</div>])

        }
        
    }, [])

    return (

        <div className={styles.container}>

            <div className={styles.answerContainer}>
                        
                { buttonElems }
                
            </div>

            Click the buttons in this order...

        </div>


    )

}