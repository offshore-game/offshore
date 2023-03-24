import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthProp } from "../../../utils/propTypes";
import Home from "../Home";

// This is passed in the navigate (state: {}) parameter from Join. From index this is undefined.
type LobbyProp = {
    otherPlayers?: string[]
}

export default function Lobby(props: AuthProp & LobbyProp) {

    const nav = useNavigate();
    const { id } = useParams(); // Rip the ID from the URL (wildcard defined in index.tsx)

    // Prevent Accidental Reloads
    window.onbeforeunload = (event) => {
        return "Are you sure you want to reload?";
    };

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

            { id }

        </Home>
    )

}