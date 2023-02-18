import { useEffect } from "react"

export default function SpeedButton(props: { index: number, timings: number[] }) {

    useEffect(() => {

        console.log(`Index of ${props.index} and timings of ${props.timings}`)

    }, [])

    return (
        <div>
            {props.index}
        </div>
    )

}