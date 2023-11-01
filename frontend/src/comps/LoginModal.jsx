import * as Bootstrap from 'react-bootstrap';

export default function LoginModal({ show, onClose, openSignUp }) {
  return (
    <>
      <Bootstrap.Modal show={show} centered>
        <Bootstrap.Modal.Header>
          <Bootstrap.Modal.Title>Login</Bootstrap.Modal.Title>
          <Bootstrap.CloseButton onClick={onClose} />
        </Bootstrap.Modal.Header>

        <Bootstrap.Modal.Body>
          <Bootstrap.Form>
            <Bootstrap.Form.Group className="mb-3" controlId="login-email">
              <Bootstrap.Form.FloatingLabel controlId="floatingEmailInput" label="Email">
                <Bootstrap.Form.Control type="email" placeholder="Enter email" />
              </Bootstrap.Form.FloatingLabel>
            </Bootstrap.Form.Group>

            <Bootstrap.Form.Group className="mb-3" controlId="login-password">
              <Bootstrap.Form.FloatingLabel controlId="floatingPasswordInput" label="Password">
                <Bootstrap.Form.Control type="password" placeholder="Password" />
              </Bootstrap.Form.FloatingLabel>
            </Bootstrap.Form.Group>
          </Bootstrap.Form>

        </Bootstrap.Modal.Body>

        <Bootstrap.Modal.Footer>
          <Bootstrap.Form.Text className="text-muted">
            Don't have an account? <a href="#" onClick={() => {
              onClose()
              openSignUp()
            }}>Sign up</a>
          </Bootstrap.Form.Text>
          <Bootstrap.Button variant="primary" type="submit">
            Get in
          </Bootstrap.Button>
        </Bootstrap.Modal.Footer>
      </Bootstrap.Modal>
    </>
  )
}