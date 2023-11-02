import * as Bootstrap from 'react-bootstrap'
import MainNavbar from '$/comps/MainNavbar'

function LimanaSlogan() {
  return (
    <>
      <h1 className='display-1'>Limana</h1>
      <h2 className='display-6'>Unlock the World of Knowledge together. Open your Portal to Endless Stories!</h2>
    </>
  )
}

function LimanaFooter() {
  return (
    <>
      <p>Project Limana - Library manager by Team HAT 🤠</p>
    </>
  )
}

export default function Home() {
  return (
    <>
      <Bootstrap.Container className='vh-100 d-flex flex-column justify-content-between' fluid>
        <Bootstrap.Row className='justify-content-center align-items-center'>
          <Bootstrap.Col className='text-center'>
            <MainNavbar />
          </Bootstrap.Col>
        </Bootstrap.Row>

        <Bootstrap.Row className='justify-content-center align-items-center flex-grow-1'>
          <Bootstrap.Col className='text-center'>
            <LimanaSlogan />
          </Bootstrap.Col>
        </Bootstrap.Row>

        <Bootstrap.Row className='justify-content-center align-items-center'>
          <Bootstrap.Col className='text-center'>
            <LimanaFooter />
          </Bootstrap.Col>
        </Bootstrap.Row>
      </Bootstrap.Container>
    </>
  )
}