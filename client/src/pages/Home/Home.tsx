import React from 'react'
import styles from './Home.module.css'
import { ReactComponent as Logo } from '../../assets/logo.svg'

/*

New Home Framework:
- Separate pages/links/urls
- Similar design with the box in the middle
- No flashy animation (please)

*/

export default function Home(props: { children?: any, className?: string }) {

    return (
        <React.Fragment>
            
            <div className={styles.container}>
                <img className={styles.logo} src={"/logo new.png"}/>

                <div className={`${styles.centerContainer} ${props.className}`}>

                    {/* this is really just a template */}
                    { props.children }

                </div>
                <span>TSA ID: <b>Team #2088-1</b></span>
            </div>

            <div id={"gameErrorContainer"} className={styles.hiddenErrorContainer}>Oops! Looks like an error occured.</div>
        </React.Fragment>
    )

}
