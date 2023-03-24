import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthProp } from "../../../utils/propTypes";
import Home from "../Home";

export default function Lobby(props: AuthProp) {

    const nav = useNavigate();

    useEffect(() => {
        
        const auth = async () => {
            // Attempt to rejoin the lobby if we are not already authenticated in.
            await props.requests.rejoinLobby().catch((err) => {
                nav('/', { replace: true });
            })
        }
        auth()

        // Insert data gathering info here
        // Lobby ID + other players ( if from join )

    }, [])

    return (
        <Home>

            lobby here ok

        </Home>
    )

}