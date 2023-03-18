import { useEffect, useState } from "react"
import styles from './ButtonCombinationManual.module.css'

type solutionType = { fragments: { buttonOrder: string, buttonIndex: number }[] }

export default function ButtonCombinationManual(props: { solution: solutionType }) {

    console.log(props.solution) //i forgor the structure of this

    const [ buttonElems, setButtonElems ] = useState([] as any[])

    useEffect(() => {

        /*for (let i = 0; i < Object.keys(props.solution).length; i++) { // WARNING: Internally base 0
            setButtonElems(entries => [...entries, <div key={i} className={designs.button}>{parseInt(props.solution.fragments.find(solution => solution.buttonIndex == i)?.buttonOrder!) + 1}</div>])
        }*/

        for (let i = 0; i < props.solution.fragments.length; i++) { // WARNING: Internally base 0

            setButtonElems(entries => [...entries, <div key={i} className={styles.button} style={{ backgroundColor: "white", color: "black" }}>{parseInt(props.solution.fragments.find(solution => solution.buttonIndex == i)?.buttonOrder!) + 1}</div>])

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