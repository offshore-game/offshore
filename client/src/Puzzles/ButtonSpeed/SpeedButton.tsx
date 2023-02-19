import { useEffect, useRef } from "react"
import styles from './ButtonSpeed.module.css'

export default function SpeedButton(props: { index: number, timings: number[], timeToHit: number, reset: React.Dispatch<boolean>, setTimeouts: React.Dispatch<any>, resetEvent: Event }) {
    
    const button = useRef(undefined as any) as React.MutableRefObject<HTMLDivElement>

    
    // https://felixgerschau.com/react-hooks-settimeout/
    // What about throwing the timeouts into a ref?


    useEffect(() => {

        // Decide if the button was pressed properly or not
        
        // Initialize the timers
        function initialize() {
            
            const btnColor = button.current.style.backgroundColor // ERROR: this isn't updating bruh
            const pass = (btnColor == "gray")

            console.log('timers re-initialized')
            for (const timing of props.timings) {

                const delay = setTimeout(() => {
    
                    // Trigger the color change of the button
                    button.current.style.backgroundColor = "blue"

                    // Now we wait... (Button Expiration Timer)
                    const expirationTimer = setTimeout(() => {

                        console.log('resulting color....', btnColor)

                        if (pass) {
    
                            // Player pressed the button in time
                            button.current.style.backgroundColor = "gray"
    
                            return;
    
                        } else if (!pass) {
    
                            // Player did not press the button in time
                            button.current.style.backgroundColor = "red"
    
                            return props.reset(true);
    
                        }
    
                    }, props.timeToHit * 1000 /* S --> MS */)

                    props.setTimeouts((entries: any) => [...entries, expirationTimer])
    
                }, timing * 1000 /* S --> MS */)
    
                props.setTimeouts((entries: any) => [...entries, delay])
                
            }

        }


        // "Do we even need timers for this button?"
        if (props.timings) {
            
            initialize() // Run the init

            // Listen for future init requests
            document.addEventListener('onBtnSpeedReset', () => {

                // The game has to reset
                button.current.style.backgroundColor = "gray" // Reset the colors

                // Init the timers again
                initialize()

            })

        }

    }, [])

    return (
        <div ref={button} className={styles.button} onClick={() => {

            const color = button.current.style.backgroundColor
            console.log("button's self color:", color)

            if (color == "gray" || color == "") { // default value is ""

                // Inactive button; invalid
                button.current.style.backgroundColor = "red"
                return props.reset(true);

            }

            
            // Don't care if it's Red


            if (color == "blue") {

                // return gray
                button.current.style.backgroundColor = "gray"

            }

        }}>
            {props.index}
        </div>
    )

}