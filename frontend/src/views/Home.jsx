import * as Bootstrap from 'react-bootstrap'
import * as BootstrapIcon from 'react-bootstrap-icons'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { TypeAnimation } from 'react-type-animation'

import MainNavbar from '$/comps/MainNavbar'
import LimanaFooter from '$/comps/LimanaFooter'

function LimanaSlogan() {
  return (
    <>
      <h1 className='display-1'><b>Limana</b></h1>
      <h2 className='display-6'>
        <TypeAnimation
          sequence={[
            "Unlock the World of Knowledge together.",
            2000,
            "Open your Portal to Endless Stories!",
            2000,
            "Your Personal Library, Your Way!",
            2000,
            "Discover, Organize, Read - Your Rules.",
            2000,
            "Elevate Your Reading Game.",
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

  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")

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
                  <Bootstrap.Form.Group className="w-50">
                    <Bootstrap.InputGroup>
                      <Bootstrap.FloatingLabel controlId="floatingInput" label="Looking for a book...?">
                        <Bootstrap.Form.Control
                          type="text"
                          placeholder="Search"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)} />
                      </Bootstrap.FloatingLabel>
                      <Bootstrap.Button variant="secondary" onClick={() => navigate(`/search?s=${searchQuery}`)}>
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