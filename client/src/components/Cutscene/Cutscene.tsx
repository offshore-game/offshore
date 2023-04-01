import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import styles from './Cutscene.module.css';
import { BiVolumeMute, BiVolumeFull } from 'react-icons/bi';

export default function Cutscene(props: { type: "INTRO" | "PASS" | "FAIL" }) {

    const nav = useNavigate()

    const video = useRef(null as any as HTMLVideoElement)
    const overlay = useRef(null as any as HTMLDivElement)
    const muteButton = useRef(null as any as HTMLDivElement)

    const [ mute, setMute ] = useState({ isMuted: true, muteElem: <BiVolumeMute style={{ height: "100%", width: "100%" }}/> })

    useEffect(() => {

        // Reload (bug fix)
        overlay.current.className = styles.failOverlay

        // Fade in the mute icon
        setTimeout(() => {

            muteButton.current.className = styles.muteIcon

        }, 500)

        if (props.type == "FAIL") {

            // Wait 5 seconds before showing interactive overlay
            setTimeout(() => {
                overlay.current.className = styles.failVisible
            }, 4000)
 
        }

    }, [])

    if (props.type == "FAIL" || props.type == "INTRO") {

        return (
            <div className={styles.container}>

                <video autoPlay={true} muted={true} ref={video} className={styles.video} src='/Cutscenes/Fail.mp4' onEnded={() => {
                    
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

                <div ref={overlay} className={styles.failOverlay}>
                
                    GAME OVER
                    <Button className={styles.button} text="Home" onClick={() => {

                        // Navigate Home
                        nav('/', { replace: true })
                        nav(0)

                    }}/>
                
                </div>

            </div>
        )

    }

    return (<div/>) // Error Suppression

}
