import { useEffect, useState } from "react"
import styles from './ButtonCombinationManual.module.css'

type solutionType = { fragments: { buttonOrder: string, buttonIndex: number }[] }

export default function ButtonCombinationManual(props: { buttonCount: number, solution: solutionType, totalFragments: number }) {

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

            <div style={{ textAlign: "center", margin: "2%"  }}>
                <br/>
                <u style={{ fontSize: "80%" }}>Give these instructions to the crewmates:</u>
                <br/>
                Press the buttons on screen in this order...
                <br/>
                Press submit when you're done!
                <br/>
                {props.totalFragments > 1 ? "(Pro-Tip: The other captains hold the manuals for the numbers you don't know about!)" : "" }
                <br/>
                <br/>
                <u>Instructions Fragment 1 of <b>{props.totalFragments}</b></u>
            </div>

        </div>


    )

}