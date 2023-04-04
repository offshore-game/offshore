import React, { useEffect, useRef, useState } from "react";
import { PuzzleInfo, zoneNames } from "../../../../../API/requests";
import { AuthProp } from "../../../../../utils/propTypes";
import NumberCombinationPuzzle from "../../../../../Puzzles/NumberCombination/Puzzle/NumberCombinationPuzzle";
import ButtonCombinationPuzzle from "../../../../../Puzzles/ButtonCombination/Puzzle/ButtonCombinationPuzzle";
import gameStyles from '../../../Game.module.css';
import pointPos from './Points.module.css';
import stopwatch from '../../../../../assets/Game/Stopwatch.svg';
import ButtonSpeed from "../../../../../Puzzles/ButtonSpeed/Puzzle/ButtonSpeed";
import toVisualZoneName from "../../../../../utils/zoneNameConversion";

export default function PointTarget(props: { className: string, puzzle: PuzzleInfo, setActivePuzzle: React.Dispatch<{ element: JSX.Element, zoneName: zoneNames }>, sounds: { mouseUp: HTMLAudioElement, mouseDown: HTMLAudioElement } } & AuthProp) {

    const [ remainingTime, setRemainingTime ] = useState(props.puzzle.remainingTime)
    const [ timerFunction, setTimerFunction ] = useState(undefined as any)
    const [ nextColor, setNextColor ] = useState('red' as ('black' | 'red'))
    const target = useRef(undefined as any as HTMLImageElement)


    
    // Listen for changes in the remainingTime when the time bonus is added \\
    useEffect(() => {
        console.log(`Prop changed for ${props.puzzle.zoneName}: ${props.puzzle.remainingTime}`)
        setRemainingTime(props.puzzle.remainingTime)
    }, [props.puzzle.remainingTime])


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

                if (nextColor == 'red') {
                    target.current.className = pointPos.redStopwatchImg
                    setNextColor('black')
                } else if (nextColor == 'black') {
                    target.current.className = pointPos.stopwatchImg
                    setNextColor('red')
                }
                

            }

        }, 1000)

    }, [nextColor])


    return (
        <div className={`${pointPos.stopwatchContainer} ${pointPos[props.className]}`} onMouseDown={() => { props.sounds.mouseDown.play() }} onMouseUp={() => { props.sounds.mouseUp.play() }} onClick={() => {

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
                    
                } else if (props.puzzle.type == "buttonSpeed") {

                    props.setActivePuzzle({
                        element: <ButtonSpeed zoneName={props.puzzle.zoneName} layout={props.puzzle.buttonGridDimensions!} timings={props.puzzle.buttonGridTimings!} requests={props.requests}/>,
                        zoneName: props.puzzle.zoneName,
                    })
                    // etc...

                }

                activePuzzleContainer.className = gameStyles.activePuzzle
                shadow.style.zIndex = "9999"

            }

        }}>

            <img ref={target} src={stopwatch} className={pointPos.stopwatchImg}/>
            <div className={pointPos.timeText}>{ remainingTime }</div>

            <span className={pointPos.tooltip}>{toVisualZoneName(props.puzzle.zoneName)}</span>
            
        </div>
    )

}
