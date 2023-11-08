import { createContext, useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import * as Bootstrap from 'react-bootstrap';
import classnames from 'classnames';

import LoginModal from '$/comps/LoginModal';
import SignupModal from '$/comps/SignUpModal';
import ForgotPasswordModal from '$/comps/ForgotPasswordModal';
import { useAccount } from '$/comps/AccountContext';

const ModalControlContext = createContext({})

export function useModalControl() {
  return useContext(ModalControlContext)
}

function NavBarContainer() {

  const { setShowLoginModal, setShowSignupModal } = useModalControl()
  const { sessionToken, userData, logout } = useAccount()

  useEffect(() => {
    if (!sessionToken) return
  }, [sessionToken])

  return (
    <>
      <Bootstrap.Navbar className="main-navbar" expand="lg">
        <Bootstrap.Container>
          <Bootstrap.Navbar.Brand>
            <Link to="/" className="navbar-brand">
              <img src='/limana-icon.png' alt="Limana" width={50} height={50} />
            </Link>
          </Bootstrap.Navbar.Brand>

          <Bootstrap.Navbar.Toggle aria-controls="main-navbar-nav" />

          <Bootstrap.Navbar.Collapse id="main-navbar-nav">
            <Bootstrap.Nav className="me-auto">

              <Bootstrap.Nav.Item>
                <Link to="/" className="nav-link">Home</Link>
              </Bootstrap.Nav.Item>

              {
                sessionToken ?
                  (
                    <>
                      <Bootstrap.Nav.Item>
                        <Link to="/collection" className="nav-link">Collection</Link>
                      </Bootstrap.Nav.Item>
                    </>
                  ) : null
              }

              {
                userData && userData.role === 'admin' ?
                  (
                    <Bootstrap.NavDropdown title="Admin" id="admin-dropdown">
                      <Bootstrap.NavDropdown.Item>
                        <Link to="/admin/users" className="nav-link">Users</Link>
                      </Bootstrap.NavDropdown.Item>
                      <Bootstrap.NavDropdown.Item>
                        <Link to="/admin/products" className="nav-link">Products</Link>
                      </Bootstrap.NavDropdown.Item>
                      <Bootstrap.NavDropdown.Item>
                        <Link to="/admin/orders" className="nav-link">Orders</Link>
                      </Bootstrap.NavDropdown.Item>
                    </Bootstrap.NavDropdown>
                  ) : null
              }

            </Bootstrap.Nav>
          </Bootstrap.Navbar.Collapse>

          <Bootstrap.Navbar.Collapse className="justify-content-end">
            {
              sessionToken ?
                (
                  <Bootstrap.Nav>
                    <Bootstrap.Nav.Item>
                      <Link to="/account" className="nav-link">Account</Link>
                    </Bootstrap.Nav.Item>
                    <Bootstrap.Nav.Item>
                      <Bootstrap.Nav.Link onClick={() => {
                        logout()
                      }}>Logout</Bootstrap.Nav.Link>
                    </Bootstrap.Nav.Item>
                  </Bootstrap.Nav>
                ) : (
                  <Bootstrap.Nav>
                    <Bootstrap.Nav.Item>
                      <Bootstrap.Nav.Link onClick={() => setShowLoginModal(true)}>Login</Bootstrap.Nav.Link>
                    </Bootstrap.Nav.Item>
                    <Bootstrap.Nav.Item>
                      <Bootstrap.Nav.Link onClick={() => setShowSignupModal(true)}>Register</Bootstrap.Nav.Link>
                    </Bootstrap.Nav.Item>
                  </Bootstrap.Nav>
                )
            }
          </Bootstrap.Navbar.Collapse>
        </Bootstrap.Container>
      </Bootstrap.Navbar>
    </>
  )
}

function ModalContainer() {
  return (
    <>
      <LoginModal />
      <SignupModal />
      <ForgotPasswordModal />
    </>
  )
}

export default function MainNavbar() {

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  return (
    <>
      <ModalControlContext.Provider value={{
        showLoginModal,
        showSignupModal,
        showForgotPasswordModal,
        setShowForgotPasswordModal,
        setShowLoginModal,
        setShowSignupModal
      }}>
        <NavBarContainer />
        <ModalContainer />
      </ModalControlContext.Provider>
    </>
  )
}