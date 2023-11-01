import { useEffect } from 'react';
import { Container, Nav } from 'react-bootstrap';
import { Link, useLocation, useParams, useMatch } from 'react-router-dom';
import classnames from 'classnames';

import '$/views/MainNavbar.scss';

export default function MainNavbar() {

  const headPageMatch = useMatch('/:page/*')

  useEffect(() => {
    console.log('headPageMatch', headPageMatch);
  }, [headPageMatch]);

  return (
    <Nav className="main-navbar">

      <Container fluid>
        <Link to="/" className={classnames({
          active: headPageMatch == undefined
        })}>Home</Link>
      </Container>

    </Nav>
  )
}