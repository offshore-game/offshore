import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import Home from "../Home";
import styles from './Tutorial.module.css'

export default function Tutorial() {

    const nav = useNavigate();

    return (
        <Home>
            
            <BiArrowBack className={styles.backButton} onClick={() => {

                nav(`/`, { replace: true }) 

            }}/>

            <div className={styles.container}>
                
                <p style={{ margin: "2%" }}>
                    Welcome to Offshore! This game challenges your communication, problem-solving, and time-management skills. The game is played with an <b>optimal</b> player count of 4-8 people, a minimum of 2, and a maximum of 10. 

                    When the game begins, a five-minute timer and a 100 health point health bar will appear at the top of the screen. 

                    As the five-minute timer decreases, the overall difficulty of the puzzles increases. This occurs at one-minute intervals, splitting the game into five levels or “stages”.

                    To keep the boat from sinking at sea, players will be assigned to the role of either <b>crewmate</b> or <b>captain</b>, who must collaborate to not damage the ship beyond repair by the end of the five-minute timer. 

                    For the best experience, the game is intended to be played without viewing other players' screens.

                    <br/>
                    <br/>

                    <b><u>CREWMATES (Players who complete puzzles)</u></b>
                    <br/>
                    After set intervals of time, flashing 60-second timers appear at certain locations on the boat with a puzzle assigned to each. To keep the boat running, the crewmates must quickly and successfully complete these puzzles. Supplying the puzzle with an incorrect answer, or allowing its timer to run out will result in the loss of 10 health points and 10 coins.

                    However, as a crewmate, you must ask those who hold the solutions ("<b>captains</b>") for instructions on how to solve the puzzles. The captains will have to verbally communicate the unique solutions in a certain amount of time.

                    As a crewmate, you must also communicate with fellow crewmates to not risk wasting the limited given time by accidentally working on the same puzzle at the same time.

                    Solving a puzzle correctly will grant the crewmate who solved the puzzle 10 coins, along with a 5-second bonus to all puzzle timers for everyone. Crewmates with the highest amount of coins by the end of the run will be recognized for their contributions of keeping the ship afloat.

                    <br/>
                    <br/>

                    <b><u>CAPTAINS (Players who instruct for puzzle solutions)</u></b>
                    <br/>
                    As a captain aboard the boat, it is your duty to keep the ship from sinking at sea. 

                    Captains are given solution manuals, with each page corresponding to a different puzzle that is currently active on the ship. The "<b>crewmates</b>", or puzzle solvers, will ask for instructions from the captains, and as a captain, you must verbally communicate the unique solutions in an efficient amount of time.

                    Incorrectly instructing the crewmates, or allowing for one of the puzzle timers to run out will result in the loss of 10 health points.

                    But that's not all… when multiple captains are present, each captain's manual may only hold a piece of the solution necessary to solve the puzzle; captains must communicate all of their solutions to the crewmates in order to complete some puzzles.

                    <br/>
                    <br/>

                    Can you successfully stay afloat OFFSHORE?
                </p>
                
            </div>


        </Home>
    )

}
