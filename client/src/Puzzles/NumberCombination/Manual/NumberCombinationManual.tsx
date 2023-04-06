import { useEffect, useState } from "react"
import styles from './NumberCombinationManual.module.css'

type solutionType = { fragments: { digitIndex: string, digitValue: number }[] }

export default function NumberCombinationManual(props: { digitCount: number, solution: solutionType, totalFragments: number }) {

    const [ numberElems, setNumberElems ] = useState([] as any[])

    useEffect(() => {
        setNumberElems([]) // Prevent a duplication bug on component reset.

        for (let i = 0; i < props.digitCount; i++) { // WARNING: Internally base 0

            const indexFragment = props.solution.fragments.find(solution => parseInt(solution.digitIndex) == i)

            setNumberElems(entries => [...entries, <div key={i} className={styles.button}>{indexFragment ? indexFragment.digitValue : "?"}</div>])
        
        }

    }, [])

    return (
        <div className={styles.container}>

            <div className={styles.answerContainer}>
                        
                { numberElems }
                
            </div>

            <div style={{ textAlign: "center", margin: "2%" }}>
                <br/>
                <u style={{ fontSize: "80%" }}>Give these instructions to the crewmates:</u>
                <br/>
                Use the on-screen arrows to enter this combination...
                <br/>
                {props.totalFragments > 1 ? "(Pro-Tip: The other captains hold the manuals for the numbers you don't know about!)" : "" }
                <br/>
                <br/>
                <u>Instructions Fragment 1 of <b>{props.totalFragments}</b></u>
            </div>

        </div>
    )

}