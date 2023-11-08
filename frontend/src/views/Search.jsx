import * as Bootstrap from 'react-bootstrap'

import MainNavbar from '$/comps/MainNavbar'
import LimanaFooter from '$/comps/LimanaFooter'

export default function SearchView() {
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
            <h1 className='display-1'>Search</h1>
            <h2 className='display-6'>Coming Soon</h2>
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
