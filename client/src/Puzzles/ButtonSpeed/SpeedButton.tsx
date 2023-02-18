import { useEffect, useRef } from "react"
import styles from './ButtonSpeed.module.css'

export default function SpeedButton(props: { index: number, timings: number[], timeToHit: number, reset: React.Dispatch<boolean>, setTimeouts: React.Dispatch<any>, resetEvent: Event }) {
    
    const button = useRef(undefined as any) as React.MutableRefObject<HTMLDivElement>

    useEffect(() => {

        // Decide if the button was pressed properly or not
        
        // Initialize the timers
        function initialize() {
            
            let pass = false;

            const onClick = () => {

                console.log("user pressed button of color", button.current.style.backgroundColor)

                if (button.current.style.backgroundColor == "blue") {

                    // Button should actually be pressed
                    pass = true
                    console.log('user pressed right')

                    button.current.style.backgroundColor = "gray" // Reset color

                } else {

                    button.current.style.backgroundColor = "red" // Indicate mistake
                    return props.reset(true);

                }


            }

            button.current.removeEventListener("mousedown", onClick) // Remove in case of relaod
            button.current.addEventListener("mousedown", onClick) // Add the event listener

            console.log('timers re-initialized')
            for (const timing of props.timings) {

                const name = setTimeout(() => {
    
    
                    // Trigger the color change of the button
                    button.current.style.backgroundColor = "blue"
    
    
                    // Now we wait... (Button Expiration Timer)
                    const expirationTimer = setTimeout(() => {
    
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
    
                props.setTimeouts((entries: any) => [...entries, name])
                
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
        <div ref={button} className={styles.button}>
            {props.index}
        </div>
    )

}