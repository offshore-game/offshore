import styles from './Button.module.css'

type ButtonProps = {

    text: string,
    onClick: Function | Promise<any>

}

export default function Button(props: ButtonProps) {

    return (
        <div className={styles.button} onClick={props.onClick as any}>
            {props.text}
        </div>
    )

}