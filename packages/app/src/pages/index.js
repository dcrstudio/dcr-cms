import * as React from 'react'
import safisLogo from '../images/icon.png'
import '@fontsource/inter'

const pageStyles = {
  color: '#232129',
  padding: 96,
  fontFamily: 'Inter',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}
const headingStyles = {
  margin: 0,
  color: '#155799',
}
const logoStyles = {
  height: '20rem',
  width: '20rem',
}

const IndexPage = () => (
  <main style={pageStyles}>
    <title>Hi Safis</title>
    <img style={logoStyles} alt="Safis Logo" src={safisLogo} />
    <h1 style={headingStyles}>Hello Safis</h1>
  </main>
)

export default IndexPage
