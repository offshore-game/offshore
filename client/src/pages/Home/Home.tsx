import styles from './Home.module.css'

/*

New Home Framework:
- Separate pages/links/urls
- Similar design with the box in the middle
- No flashy animation (please)

*/

export default function Home(props: { children?: any }) {

    return (
        <div className={styles.container}>
            OFFSHORE
            <div className={styles.centerContainer}>

                {/* this is really just a template */}
                { props.children }

            </div>
            TSA ID: ????
        </div>
    )

}
