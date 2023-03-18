import { useEffect, useState } from "react"
import styles from './NumberCombinationManual.module.css'

type solutionType = { fragments: { digitIndex: string, digitValue: number }[] }

export default function NumberCombinationManual(props: { solution: solutionType }) {

    const [ numberElems, setNumberElems ] = useState([] as any[])

    useEffect(() => {
        setNumberElems([]) // Prevent a duplication bug on component reset.

        for (let i = 0; i < props.solution.fragments.length; i++) { // WARNING: Internally base 0
            setNumberElems(entries => [...entries, <div key={i} className={styles.button}>{props.solution.fragments.find(solution => parseInt(solution.digitIndex) == i)?.digitValue!}</div>])
        }

    }, [])

    return (
        <div className={styles.container}>

            <div className={styles.answerContainer}>
                        
                { numberElems }
                
            </div>

            Enter this combination...

        </div>
    )

}