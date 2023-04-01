import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { gameInfo } from "../../../API/requests";
import { AuthProp } from "../../../utils/propTypes";
import Home from "../Home";
import PlayerEntry from "./PlayerEntry/PlayerEntry";
import styles from './Lobby.module.css';
import Button from "../../../components/Button/Button";

// This is passed in the navigate (state: {}) parameter from Join. From index this is undefined.
type LobbyProp = {
    otherPlayers?: string[]
}

export default function Lobby(props: AuthProp & LobbyProp) {

    const nav = useNavigate();
    const { id } = useParams(); // Rip the ID from the URL (wildcard defined in index.tsx)
    const { state } = useLocation(); // Get the passed array of other players (if any)

    const [ playerList, setPlayerList ] = useState(state ? state as string[] : [])
    
    const isOwner = sessionStorage.getItem("isOwner") == "true"
    const currentUsername = sessionStorage.getItem("username")
    const roomCode = sessionStorage.getItem("roomCode")

    // Prevent Accidental Reloads
    /*window.onbeforeunload = (event) => {
        return "Are you sure you want to reload?";
    };*/

    useEffect(() => {
        
        const auth = async () => {
            // Attempt to rejoin the lobby if we are not already authenticated in.
            await props.requests.rejoinLobby().catch((err) => {
                nav('/', { replace: true });
            })
        }
        auth()

        // Register Lobby Events \\
        props.requests.socket.on("lobbyClose", () => {
            sessionStorage.clear()
            nav(`/`, { replace: true })
            nav(0) // Reload the page to wipe the socket
            return true;
        })

        props.requests.socket.on("playerJoin", (username: string) => {
            // Add the new entry to the list
            setPlayerList(entries => [...entries, username])
        })

        props.requests.socket.on("playerLeave", (leftUsername: string) => {
            // Filter out any entries that has the old username.
            setPlayerList(playerList.filter(username => username !== leftUsername))
        })

        props.requests.socket.on("gameStart", (payload: gameInfo) => {
            nav(`/game/${id}`, { replace: true, state: payload }) // Navigate to the game page
        })

    }, [])

    return (
        <Home>

            ROOM CODE: { id }

            <div className={styles.container}>

                <div className={styles.playerList}>

                    <span className={styles.playerListHeader}>SAILORS</span>

                    <div className={styles.playerEntryContainer}>
                        
                        { playerList.map(username => <PlayerEntry key={username} username={username} isPlayer={username == currentUsername}/>) }

                    </div>

                </div>


                <div className={styles.controlButtonContainer}>

                    { isOwner ? <Button className={styles.startButton} text={"Start Game"} onClick={async () => {

                        // Request to the server to start the game.
                        const result = await props.requests.startGame()

                        if (result) {

                            nav(`/game/${roomCode}`, { replace: true, state: result }) // Navigate to the game page
                            return true;

                        }

                    }}/> : "" }

                    <Button className={styles.leaveButton} text={"Leave"} onClick={() => {

                        // We don't check for the callback value of "result" because we don't want to hang the client if
                        // their socket was reset and they are trying to leave. This was a tested bug.
                        props.requests.leaveLobby().catch((err) => {})

                        sessionStorage.clear() // Clear all variables in storage
                        nav(`/`, { replace: true }) // Go back home
                        nav(0) // Reload the page to wipe the socket and establish a new connection.
                        return true;

                    }}/>

                </div>

            </div>
            
        </Home>
    )

}