import styles from './Button.module.css'

type ButtonProps = {

    text: any,
    onClick: Function | Promise<any>,
    style?: React.CSSProperties,
    className?: string,
    id?: string

}

export default function Button(props: ButtonProps) {

    return (
        <div id={props.id} className={`${styles.button} ${props.className ? props.className : ""}`} onClick={props.onClick as any} style={props.style}>
            { props.text }
        </div>
    )

}