import React, { useState } from 'react'
import { gameInfo, zoneNames } from '../../../../API/requests'
import ButtonCombinationManual from '../../../../Puzzles/ButtonCombination/Manual/ButtonCombinationManual'
import { AuthProp } from '../../../../utils/propTypes'
import toVisualZoneName from '../../../../utils/zoneNameConversion'
import styles from './ReaderGame.module.css'
import { RxTriangleLeft, RxTriangleRight } from 'react-icons/rx'
import NumberCombinationManual from '../../../../Puzzles/NumberCombination/Manual/NumberCombinationManual'
import ButtonSpeedManual from '../../../../Puzzles/ButtonSpeed/Manual/ButtonSpeedManual'

export default function ReaderGame(props: { gameInfo: gameInfo, setGameInfo: React.Dispatch<gameInfo> } & AuthProp) {

    console.log(props.gameInfo)

    const [ activePage, setActivePage ] = useState({ number: 0, zoneName: "ZONE HERE" }) // Internally Base 0

    const answerPages = [] as { element: JSX.Element, zoneName: zoneNames }[]
    for (const puzzle of props.gameInfo.puzzles) {
        // A solution is provided for this player
        if (puzzle.solution) {

            if (puzzle.type == "buttonCombination") {
                
                answerPages.push({ element: <ButtonCombinationManual key={puzzle.zoneName} solution={puzzle.solution} buttonCount={puzzle.buttonCount!} />, zoneName: puzzle.zoneName })

            } else if (puzzle.type == "numberCombination") {

                answerPages.push({ element: <NumberCombinationManual key={puzzle.zoneName} solution={puzzle.solution} digitCount={puzzle.numberCount!} />, zoneName: puzzle.zoneName })

            } else if (puzzle.type == "buttonSpeed") {

                answerPages.push({ element: <ButtonSpeedManual key={puzzle.zoneName} layout={puzzle.buttonGridDimensions!} solution={puzzle.solution} totalFragments={puzzle.numberOfFragments!}/>, zoneName: puzzle.zoneName })

            }
            // Add more puzzles!
        }

    }


    if (answerPages.length > 0) {  // Bug Fix

        // Check if the activePage still exists
        const result = props.gameInfo.puzzles.find(puzzle => puzzle.zoneName == activePage.zoneName)
        if (!result) { // Does not exist anymore

            // Reset to the first page
            setActivePage({ number: 0, zoneName: answerPages[0].zoneName})

        }

        return (

            <React.Fragment>
                
                <div className={styles.background}>


                    <div className={styles.container}>
        
                        <div className={styles.boat}>

                        </div>
                        
                        <div className={styles.pageBase}>
                            <div style={{ margin: "5%" }}>{ toVisualZoneName(activePage.zoneName as any)?.toUpperCase() }</div>
                            { answerPages[activePage.number] ? answerPages[activePage.number].element : "" }
                        </div>

                        <div className={styles.controls}>

                            <RxTriangleLeft className={styles.arrow} onClick={() => {

                                if (activePage.number - 1 >= 0) { // Check if it's within range
                                    setActivePage({ number: activePage.number - 1, zoneName: answerPages[activePage.number - 1].zoneName })
                                }
                                

                            }}/>
                            { `${activePage.number + 1}/${answerPages.length}` }
                            <RxTriangleRight className={styles.arrow} onClick={() => {

                                if (activePage.number + 1 < answerPages.length) { // Check if it's within range
                                    setActivePage({ number: activePage.number + 1, zoneName: answerPages[activePage.number + 1].zoneName })
                                }
                                

                            }}/>

                        </div>
                    
                    </div>

                </div>



    
            </React.Fragment>
    
        )

    } else {

        return (
            <div className={styles.background}/> // On load create the background at least
        )

    }



}