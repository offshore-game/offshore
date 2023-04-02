import { useEffect, useState } from 'react'
import styles from './Button.module.css'

type ButtonProps = {

    text: any,
    onClick: Function | Promise<any>,
    style?: React.CSSProperties,
    className?: string,
    id?: string

}

export default function Button(props: ButtonProps) {

    const [ clickUpSound, setClickUpSound ] = useState(undefined as any as HTMLAudioElement)
    const [ clickDownSound, setClickDownSound ] = useState(undefined as any as HTMLAudioElement)

    useEffect(() => {

        // Load the click sounds
        setClickUpSound(new Audio('/Sounds/mouse up.mp3'))
        setClickDownSound(new Audio('/Sounds/mouse down.mp3'))

    }, [])

    return (
        <div id={props.id} className={`${styles.button} ${props.className ? props.className : ""}`} onMouseDown={() => { clickDownSound.play() }} onMouseUp={() => { clickUpSound.play() }} onClick={props.onClick as any} style={props.style}>
            { props.text }
        </div>
    )

}