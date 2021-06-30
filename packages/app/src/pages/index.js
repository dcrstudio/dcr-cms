import * as React from 'react'
import safisLogo from '../images/icon.png'
import * as styles from './index.module.sass'
import '@fontsource/inter'

const IndexPage = () => (
  <main className={styles.pageStyles}>
    <title>Hi Safis</title>
    <img className={styles.logoStyles} alt="Safis Logo" src={safisLogo} />
    <h1 className={styles.headingStyles}>Hello Safis</h1>
  </main>
)

export default IndexPage
