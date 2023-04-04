import React, { useEffect, useState } from 'react'
import { gameInfo, zoneNames } from '../../../../API/requests'
import ButtonCombinationManual from '../../../../Puzzles/ButtonCombination/Manual/ButtonCombinationManual'
import { AuthProp } from '../../../../utils/propTypes'
import toVisualZoneName from '../../../../utils/zoneNameConversion'
import styles from './ReaderGame.module.css'
import { RxTriangleLeft, RxTriangleRight } from 'react-icons/rx'
import NumberCombinationManual from '../../../../Puzzles/NumberCombination/Manual/NumberCombinationManual'
import ButtonSpeedManual from '../../../../Puzzles/ButtonSpeed/Manual/ButtonSpeedManual'
import Button from '../../../../components/Button/Button'

const sleep = async (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const randomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function ReaderGame(props: { gameInfo: gameInfo, setGameInfo: React.Dispatch<gameInfo> } & AuthProp) {

    console.log(props.gameInfo)

    const [ sounds, setSounds ] = useState({} as { [key: string]: HTMLAudioElement })

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


    useEffect(() => {

        if (answerPages.length > 0) {  // Bug Fix
            
            // Check if the activePage still exists
            const result = props.gameInfo.puzzles.find(puzzle => puzzle.zoneName == activePage.zoneName)
            if (!result) { // Does not exist anymore

                // Reset to the first page
                setActivePage({ number: 0, zoneName: answerPages[0].zoneName})

            } else {

                // Make sure the manual remains on the current page after puzzle gens
                const index = answerPages.findIndex(page => page.zoneName == activePage.zoneName)
                if (index != -1) {

                    setActivePage({ number: index, zoneName: activePage.zoneName })

                }

            }

        }

    }, [ props.gameInfo ])

    // Asset Loader \\
    useEffect(() => {

        // Load Page Turn Sounds
        const page1 = new Audio("/Sounds/page turn 1.mp3")
            page1.volume = 0.8
        const page2 = new Audio("/Sounds/page turn 2.mp3")
            page2.volume = 0.8
        setSounds(sounds => { return { ...sounds, 
            "page_1": page1,
            "page_2": page2
        }})

        // Passively Play Seagull Sounds
        const seagullSounds = {
            "seagull_1": new Audio("/Sounds/seagull 1.mp3"),
            "seagull_2": new Audio("/Sounds/seagull 2.mp3"),
            "seagull_3": new Audio("/Sounds/seagull 3.mp3"),
        }
        setSounds(sounds => { return { ...sounds, ...seagullSounds }})
        let kill = false
        let sound: any
        async function playSeagullSound() {

            const randomCooldown = randomNumber(4, 8)
            await sleep(randomCooldown * 1000)

            if (!kill) {

                const randomSound = randomNumber(1, 3)
                console.log(randomSound)
                sound = (seagullSounds as any)[`seagull_${randomSound}`] // Play the sound
                    sound.play()
                await sleep((sound.duration + 1) * 1000 )
                playSeagullSound()

            }

        }
        playSeagullSound()


        return () => {

            // Stop the seagull sounds
            kill = true
            if (sound) sound.pause()
            sound = undefined

        }

    }, [])


    if (answerPages.length > 0) {  // Bug Fix

        return (

            <React.Fragment>
                
                <div className={styles.background}>


                    <div className={styles.container}>
        
                        <div className={styles.pageBase}>
                            <div style={{ margin: "5%", textAlign: "center" }}>{ toVisualZoneName(activePage.zoneName as any)?.toUpperCase() }</div>
                            { answerPages[activePage.number] ? answerPages[activePage.number].element : "" }
                        </div>

                        <div className={styles.controls}>

                            <Button className={(activePage.number - 1 >= 0) ? styles.arrowButton : styles.inactiveArrowButton} text={ <RxTriangleLeft className={styles.arrow} /> } onClick={() => {
                                if (activePage.number - 1 >= 0) { // Check if it's within range

                                    // Play random page sound effect
                                    sounds[`page_${randomNumber(1, 2)}`].play()
                                    setActivePage({ number: activePage.number - 1, zoneName: answerPages[activePage.number - 1].zoneName })

                                }
                            }}/>
                            
                            <span className={styles.pageCount}>{ `${activePage.number + 1}/${answerPages.length}` }</span>

                            <Button className={(activePage.number + 1 < answerPages.length) ? styles.arrowButton : styles.inactiveArrowButton} text={ <RxTriangleRight className={styles.arrow} /> } onClick={() => {
                                if (activePage.number + 1 < answerPages.length) { // Check if it's within range
                                    
                                    // Play random page sound effect
                                    sounds[`page_${randomNumber(1, 2)}`].play()
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