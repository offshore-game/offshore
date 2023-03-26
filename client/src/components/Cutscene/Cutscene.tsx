import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import styles from './Cutscene.module.css';

export default function Cutscene(props: { type: "INTRO" | "PASS" | "FAIL" }) {

    const nav = useNavigate()

    const video = useRef(null as any as HTMLVideoElement)
    const overlay = useRef(null as any as HTMLDivElement)

    useEffect(() => {

        // Reload (bug fix)
        overlay.current.className = styles.failOverlay

        video.current.play()

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

                <video ref={video} className={styles.video} src='/Cutscenes/Fail.mp4' onEnded={() => {
                    
                    console.log('cutscene ended')
        
                }}/>
                
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
