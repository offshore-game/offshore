import styles from './Button.module.css'

type ButtonProps = {

    text: string,
    onClick: Function | Promise<any>,
    style?: React.CSSProperties

}

export default function Button(props: ButtonProps) {

    return (
        <div className={styles.button} onClick={props.onClick as any} style={props.style}>
            {props.text}
        </div>
    )

}