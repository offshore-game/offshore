import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import styles from './Cutscene.module.css';
import { BiVolumeMute, BiVolumeFull } from 'react-icons/bi';
import { BsHouseDoorFill } from 'react-icons/bs';
import Leaderboard from '../Leaderboard/Leaderboard';

export default function Cutscene(props: { type: "INTRO" | "PASS" | "FAIL", leaderboard?: { username: string, coins: number }[] }) {

    const nav = useNavigate()

    const video = useRef(null as any as HTMLVideoElement)
    const muteButton = useRef(null as any as HTMLDivElement)

    const overlay = useRef(null as any as HTMLDivElement)
    const button = useRef(null as any as HTMLDivElement)
    const header = useRef(null as any as HTMLDivElement)

    const [ mute, setMute ] = useState({ isMuted: true, muteElem: <BiVolumeMute style={{ height: "100%", width: "100%" }}/> })
    const [ time, setTime ] = useState(new Date().getTime())

    useEffect(() => {

        if (overlay.current) {

            // Reload (bug fix)
            overlay.current.className = styles.failOverlay

        }
        
        // Fade in the mute icon
        setTimeout(() => {

            muteButton.current.className = styles.muteIcon

        }, 500)

        if (props.type == "FAIL") {

            // Wait 5 seconds before showing interactive overlay
            setTimeout(() => {
                muteButton.current.className = styles.hiddenMuteIcon

                overlay.current.className = styles.failVisible

                header.current.className = styles.header
                setTimeout(() => {
                    
                    button.current.className = styles.btnContainer

                }, 1000);

            }, 4000)
 
        }

        if (props.type == "PASS") {

            // Wait 6 seconds before showing the leaderboard overlay
            setTimeout(() => {

                muteButton.current.className = styles.hiddenMuteIcon
                overlay.current.className = styles.failVisible

            }, 6000)

        }

    }, [])

    let overlayElem = <div />
    let filepath = ""

    if (props.type == "FAIL") {

        // Show the fail overlay
        overlayElem = (<div ref={overlay} className={styles.failOverlay}>
            
            <span ref={header} className={styles.hiddenHeader}>Game Over</span>

            <span ref={button} className={styles.hiddenBtnContainer}>

                <Button className={styles.button} text={<BsHouseDoorFill />} onClick={() => {

                    // Navigate Home
                    nav('/', { replace: true })
                    nav(0)

                }}/>

            </span>

        </div>)

        filepath = "/Cutscenes/Fail.mp4"


    } else if (props.type == "PASS") {

        // Show the leaderboard
        overlayElem = (
            <div ref={overlay} className={styles.failOverlay} style={{ position: "absolute", left: "0", top: "0", height: "100%", width: "100%" }}><Leaderboard leaderboard={props.leaderboard!} /></div>
        )

        filepath = "/Cutscenes/Success.mp4"

    } else if (props.type == "INTRO") {

        // CHANGE TO INTRO CUTSCENE PATH
        filepath = "/Cutscenes/Success.mp4"

    }

    return (
        <div className={styles.container}>

            <video autoPlay={true} muted={true} ref={video} className={styles.video} src={`${filepath}?a=${time /* Bypass browser cache; it breaks sometimes */}`} onEnded={() => {
                
                console.log('cutscene ended')
    
            }}/>
            
            <div ref={muteButton} className={styles.hiddenMuteIcon} onClick={() => {

                // Switch the element and change the state
                if (mute.isMuted) {

                    // Unmute
                    video.current.muted = false
                    setMute({ isMuted: false, muteElem: <BiVolumeFull style={{ height: "100%", width: "100%" }}/> })

                } else {

                    // Mute
                    video.current.muted = true
                    setMute({ isMuted: true, muteElem: <BiVolumeMute style={{ height: "100%", width: "100%" }}/> })

                }

            }}>

                { mute.muteElem }

            </div>

            { overlayElem }



        </div>
    )

    /*if (props.type == "FAIL" || props.type == "INTRO") {



    }

    return (<div/>) // Error Suppression*/

}
