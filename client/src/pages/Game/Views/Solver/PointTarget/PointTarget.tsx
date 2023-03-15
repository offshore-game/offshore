import React, { useEffect, useRef, useState } from "react";
import { PuzzleInfo, zoneNames } from "../../../../../API/requests";
import { AuthProp } from "../../../../../utils/propTypes";
import NumberCombinationPuzzle from "../../../../../Puzzles/NumberCombination/Puzzle/NumberCombinationPuzzle";
import ButtonCombinationPuzzle from "../../../../../Puzzles/ButtonCombination/Puzzle/ButtonCombinationPuzzle";
import gameStyles from '../../../Game.module.css'
import pointPos from './Points.module.css'

export default function PointTarget(props: { className: string, puzzle: PuzzleInfo, setActivePuzzle: React.Dispatch<{ element: JSX.Element, zoneName: zoneNames }> } & AuthProp) {

    const [ remainingTime, setRemainingTime ] = useState(props.puzzle.remainingTime)
    const [ timerFunction, setTimerFunction ] = useState(undefined as any)
    const [ nextColor, setNextColor ] = useState('red' as ('black' | 'red'))
    const target = useRef(undefined as any as HTMLDivElement)

    // Expiry Timer
    useEffect(() => {

        setTimerFunction(setInterval(() => {
            setRemainingTime(prevTime => prevTime - 1)
        }, 1000))

        return () => {

            console.log(`clear interval for ${props.puzzle.zoneName}`)
            clearInterval(timerFunction)

        }

    }, [])


    // Blinking Timer
    useEffect(() => {

        setTimeout(() => {

            if (target.current) {

                target.current.style.backgroundColor = nextColor
                nextColor == 'black' ? setNextColor('red') : setNextColor('black')

            }

        }, 1000)

    }, [nextColor])


    return (
        <div ref={target} className={pointPos[props.className]} style={{ zIndex: "999", cursor: "pointer" }} onClick={() => {

            console.log('clicked')

            // Animate the "activePuzzle" div in
            const activePuzzleContainer = document.getElementById('activePuzzleContainer')
            const shadow = document.getElementById('shadow')

            if (activePuzzleContainer && shadow) {

                // FEATURE: differentiate between different types of puzzles

                if (props.puzzle.type == "numberCombination") {

                    props.setActivePuzzle({ 
                        element: <NumberCombinationPuzzle count={props.puzzle.numberCount!} zoneName={props.puzzle.zoneName} requests={props.requests}/>,
                        zoneName: props.puzzle.zoneName 
                    })

                } else if (props.puzzle.type == "buttonCombination") {
                    
                    props.setActivePuzzle({
                        element: <ButtonCombinationPuzzle count={props.puzzle.buttonCount!} zoneName={props.puzzle.zoneName} requests={props.requests}/>,
                        zoneName: props.puzzle.zoneName,
                    })
                    // etc...

                }

                activePuzzleContainer.className = gameStyles.activePuzzle
                shadow.style.zIndex = "9999"

            }

        }}>
            { remainingTime }
        </div>
    )

}
