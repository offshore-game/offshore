import React, { useEffect } from "react";

export default function Auth(props: any) {

    useEffect(() => {

        const auth = async () => { // Making the top function async supposedly creates a bug, so don't do that :).
            const validation = await props.requests.validateToken()
            console.log("Request File Result: ", validation)

            if (validation) {
                return true;
            } else {



            }
        }
        auth()

        return () => {
            // Called when component is unmounted \\
        }

    }, [])

    return (
        <div />
    )
}
