import * as Bootstrap from 'react-bootstrap'
import * as BootstrapIcon from 'react-bootstrap-icons'

import { TypeAnimation } from 'react-type-animation'

import MainNavbar from '$/comps/MainNavbar'
import LimanaFooter from '$/comps/LimanaFooter'

function LimanaSlogan() {
  return (
    <>
      <h1 className='display-1'>Limana</h1>
      <h2 className='display-6'>
        <TypeAnimation
          sequence={[
            "Unlock the World of Knowledge together",
            2000,
            "Open your Portal to Endless Stories!",
            2000
          ]}
          wrapper="span"
          repeat={Infinity}
          cursor={true}
          speed={130}
        />
      </h2>
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
            <Bootstrap.Row className='justify-content-center align-items-center'>
              <Bootstrap.Col className='text-center'>
                <LimanaSlogan />
              </Bootstrap.Col>
            </Bootstrap.Row>

            <Bootstrap.Row className="m-3">
              <Bootstrap.Col>
                <Bootstrap.Form className='d-flex justify-content-center align-items-center'>
                  <Bootstrap.Form.Group className="mb-3 w-50">
                    <Bootstrap.InputGroup>
                      <Bootstrap.FloatingLabel controlId="floatingInput" label="Looking for a book...?">
                        <Bootstrap.Form.Control type="text" placeholder="Search" />
                      </Bootstrap.FloatingLabel>
                      <Bootstrap.Button variant="secondary">
                        <BootstrapIcon.Search />
                      </Bootstrap.Button>
                    </Bootstrap.InputGroup>
                  </Bootstrap.Form.Group>
                </Bootstrap.Form>
              </Bootstrap.Col>
            </Bootstrap.Row>
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