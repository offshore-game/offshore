import { useEffect, useState } from "react"
import designs from '../Puzzle/ButtonCombinationPuzzle.module.css'

type solutionType = { buttonOrder: string, buttonIndex: number }[]

export default function ButtonCombinationManual(props: { solution: solutionType }) {

    console.log(props.solution) //i forgor the structure of this

    const [ buttonElems, setButtonElems ] = useState([] as any[])

    useEffect(() => {

        for (let i = 0; i < Object.keys(props.solution).length; i++) { // WARNING: Internally base 0
            setButtonElems(entries => [...entries, <div key={i} className={designs.button}>{parseInt(props.solution.find(solution => solution.buttonIndex == i)?.buttonOrder!) + 1}</div>])
        }
        
    }, [])

    return (
        <div className={designs.container}>

            <div className={designs.buttonContainer}>
                
                { buttonElems }

            </div>

        </div>
    )

}