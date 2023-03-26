import { useEffect, useRef } from 'react';
import styles from './Cutscene.module.css';

export default function Cutscene() {

    const video = useRef(null as any as HTMLVideoElement)

    useEffect(() => {

        video.current.play()

    }, [])

    return (
        <video ref={video} className={styles.video} src='/Cutscenes/Fail.mp4' onEnded={() => {
            
            console.log('cutscene ended')

        }} />
    )

}