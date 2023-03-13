import { useEffect, useState } from "react"
import designs from '../Puzzle/ButtonCombinationPuzzle.module.css'

type solutionType = { digitIndex: string, digitValue: number }[]

export default function NumberCombinationManual(props: { solution: solutionType }) {

    console.log(props.solution)

    const [numberElems, setNumberElems] = useState([] as any[])

    useEffect(() => {
        setNumberElems([]) // Prevent a duplication bug on component reset.

        for (let i = 0; i < props.solution.length; i++) {
            setNumberElems(entries => [...entries, <div key={i} className={designs.button}>

                { (props.solution[i].digitIndex == `${i}`) ? props.solution[i].digitValue : "" }

            
            </div>])
        }
    }, [])

    return (
        <div className={designs.container}>

            <div className={designs.buttonContainer}>
                
                { numberElems }

            </div>
        </div>
    )

}