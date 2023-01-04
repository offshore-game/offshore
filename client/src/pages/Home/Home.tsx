import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button';

import { AuthProp } from '../../utils/propTypes'
import CreateView from './CreateView/CreateView';
import styles from './Home.module.css'
import LobbyView from './LobbyView/LobbyView';

import { ReactComponent as JoinMenuStack } from '../../assets/MainMenu/joinMenuStack.svg'

type HomeProps = {

    joinMenu?: boolean
    createMenu?: boolean
    gameLobby?: boolean

}

export default function Home(props: AuthProp & HomeProps) {
    const navigate = useNavigate();
    const [joinMenuView, setJoinMenuView] = useState(props.joinMenu ? true : false);
    const [createMenuView, setCreateMenuView] = useState(props.createMenu ? true : false);
    const [gameLobbyView, setGameLobbyView] = useState(props.gameLobby ? true : false);
    const [otherPlayers, setOtherPlayers] = useState(undefined as any)

    useEffect(() => {

        const canAuth = async () => {
            const token = localStorage.getItem("token")!
            const roomCode = localStorage.getItem("roomCode")!
    
            if (token && roomCode) {
                const result = await props.requests.rejoinLobby()
                if (result) {
                    
                    // Redirect user to the lobby.
                    navigate(`/lobby/${roomCode}`, { replace: true })
                    return true;
                    
                }
            }
        }

        canAuth()

    }, [])


    const joinGameItems = useRef(null as any) as React.MutableRefObject<HTMLDivElement>;
    const screen = useRef(null as any) as React.MutableRefObject<HTMLDivElement>;
    const table = useRef(null as any) as React.MutableRefObject<HTMLDivElement>;


    return (
        <div className={styles.background}>
            <div ref={table} className={joinMenuView ? styles.zoomedTable : styles.table} />


            <JoinMenuStack className={joinMenuView ? styles.zoomedItemsContainer : styles.joinItemsContainer}>

                {joinMenuView ?
                    <React.Fragment>

                        <div onClick={() => {

                            window.history.replaceState(null, window.document.title, "/")
                            return setJoinMenuView(false);

                        }}>
                            <div className={styles.backButton}>Back Button?</div>
                        </div>

                        

                        <input id="usernameInput-Join" className={styles.textBox} type="text" placeholder="Username" />
                        <input id="roomCodeInput" className={styles.textBox} type="text" placeholder="Room Code" />

                        <Button text="Join" onClick={async () => {
                        
                            // When the player wants to join
                            const username = document.getElementById("usernameInput-Join") as HTMLTextAreaElement
                            const roomCode = document.getElementById("roomCodeInput") as HTMLTextAreaElement
                            

                            const result = await props.requests.joinLobby(username.value, roomCode.value).catch((err) => { throw err; })
                            // Lobby successfully joined
                            if (result) {

                                // Set state and do animations
                                setJoinMenuView(false);
                                setCreateMenuView(false);

                                setGameLobbyView(true);
                                
                                // To pass to the lobby screen
                                setOtherPlayers(result)

                                navigate(`/lobby/${roomCode.value}`, { replace: true, state: result })
    
                            }

                        }}/>

                    </React.Fragment>
                    
                : <div/>}

            </JoinMenuStack>

            {/* Code for the projector screen */}
            <div ref={screen} className={joinMenuView ? styles.zoomedScreen : styles.screen}>

                {!gameLobbyView && !createMenuView && !joinMenuView ?
                    // The Buttons on the Projector Screen (JOIN/CREATE)
                    <React.Fragment>
                        <div className={styles.screenButton} onClick={() => {

                            // Can't navigate() because we don't want to cause a component reload, we want to show the animation.
                            window.history.replaceState(null, window.document.title, "/join")

                            return setJoinMenuView(true);

                        }}>
                            JOIN
                        </div>

                        
                        <div className={styles.screenButton} onClick={() => {
                            // Set state
                            setJoinMenuView(false);
                            setGameLobbyView(false);

                            setCreateMenuView(true);
                            
                            navigate(`/create`, { replace: true })
                        }}>
                            CREATE
                        </div>
                    </React.Fragment>


                    
                :
                    gameLobbyView ? <LobbyView requests={props.requests} otherPlayers={otherPlayers} setLobbyState={setGameLobbyView}/> :
                    
                    createMenuView ? <CreateView requests={props.requests} setCreateState={setCreateMenuView} setLobbyState={setGameLobbyView}/> : <div/>
                }


            </div>
        </div>
    )

}
