import { useEffect, useState } from 'react';
import { Link, useLocation, useParams, useMatch } from 'react-router-dom';
import * as Bootstrap from 'react-bootstrap';
import classnames from 'classnames';
import LoginModal from '$/comps/LoginModal';
import SignupModal from '$/comps/SignUpModal';

import '$/views/MainNavbar.scss';

export default function MainNavbar() {

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  return (
    <>
      <Bootstrap.Navbar className="main-navbar" expand="lg">
        <Bootstrap.Container>
          <Bootstrap.Navbar.Brand>
            <Link to="/" className="navbar-brand">
              <img src='/limana-icon.png' id="limana-icon-image" alt="Limana" />
            </Link>
          </Bootstrap.Navbar.Brand>

          <Bootstrap.Navbar.Toggle aria-controls="main-navbar-nav" />

          <Bootstrap.Navbar.Collapse id="main-navbar-nav">
            <Bootstrap.Nav className="me-auto">

              <Bootstrap.Nav.Item>
                <Link to="/" className="nav-link">Home</Link>
              </Bootstrap.Nav.Item>

            </Bootstrap.Nav>
          </Bootstrap.Navbar.Collapse>

          <Bootstrap.Navbar.Collapse className="justify-content-end">
            <Bootstrap.Nav>
              <Bootstrap.Nav.Item>
                <Bootstrap.Nav.Link onClick={() => setShowLoginModal(true)}>Login</Bootstrap.Nav.Link>
              </Bootstrap.Nav.Item>
              <Bootstrap.Nav.Item>
                <Bootstrap.Nav.Link onClick={() => setShowSignupModal(true)}>Register</Bootstrap.Nav.Link>
              </Bootstrap.Nav.Item>
            </Bootstrap.Nav>
          </Bootstrap.Navbar.Collapse>
        </Bootstrap.Container>
      </Bootstrap.Navbar>

      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        openSignUp={() => setShowSignupModal(true)} />
      <SignupModal
        show={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        openLogIn={() => setShowLoginModal(true)} />
    </>
  )
}