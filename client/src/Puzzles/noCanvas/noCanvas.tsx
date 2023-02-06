// https://www.youtube.com/watch?v=LgTrwpMCww8

import { useEffect } from 'react';
import styles from './noCanvas.module.css'

export default function TestNoCanvas() {

    useEffect(() => {

        // Make the line
        const pointOne = { x: 100, y: 0 } // coordinates are correct, just not linked to the element itself

        // Using the same math formula as cdPoint but pointing somewhere else?
        /*const pointTwo = { x: window.innerWidth / 2, y: window.innerHeight / 2} // GOAL: put it in the center

        console.log(window.innerWidth)
        console.log(window.innerHeight)

        const slope = ((pointTwo.y - pointOne.y) / (pointTwo.x - pointOne.x))
        const distance = Math.sqrt( Math.pow( (pointTwo.x - pointOne.x) , 2) + Math.pow( (pointTwo.y - pointOne.y) , 2) )
        let degree = Math.atan(slope) * (180 / Math.PI) // DEBUG: this is being messed up by the 16/9 margin bars, need an offset.
            console.log(degree)

        if (degree < 0) {

            degree = Math.abs(degree + 180) // Quadrants are a nightmare

        }

        const element = document.getElementById("line")!
            element.style.width = `${distance}px`
            element.style.transform = `rotate(${degree}deg)`
            element.style.height = "1px"
        
        const testPoint = document.getElementById("cdPoint")!
            testPoint.style.position = `absolute`
            testPoint.style.top = `${window.innerHeight / 2}px` // this is saying one thing    
            testPoint.style.left = `${window.innerWidth / 2}px`
            testPoint.style.height = "10px";
            testPoint.style.width = "10px";
            testPoint.style.backgroundColor = "black";
        
        console.log(testPoint.getBoundingClientRect()) // this is saying another thing? (the issue was in index.css position:relative bruh) [wait why is setting this fixing the problem]

        // why is setting it to relative "fixing" it?*/


        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        const container = document.getElementById("ctr")!
        container.addEventListener("mousemove", (mouseEvent) => {

            const rect = container.getBoundingClientRect();

            const pointTwo = { x: mouseEvent.x - rect.left, y: mouseEvent.y - rect.top }

            const slope = ((pointTwo.y - pointOne.y) / (pointTwo.x - pointOne.x))
            const distance = Math.sqrt(Math.pow((pointTwo.x - pointOne.x), 2) + Math.pow((pointTwo.y - pointOne.y), 2))
            let degree = Math.atan(slope) * (180 / Math.PI)

            if (degree < 0) {

                degree = Math.abs(degree + 180)

            }
    
            const element = document.getElementById("line")!
                element.style.width = `${distance}px`
                element.style.transform = `rotate(${degree}deg)`
                element.style.height = "1px"

        })


    }, [])

    return (
        <div id="ctr" className={styles.container}>

            <div id="line" className={styles.line} />

        </div>
    )

}