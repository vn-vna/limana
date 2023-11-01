import * as Bootstrap from 'react-bootstrap';

export default function SignupModal({ show, onClose, openLogIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <>
      <Bootstrap.Modal show={show} centered>
        <Bootstrap.Modal.Header>
          <Bootstrap.Modal.Title>SignUp</Bootstrap.Modal.Title>
          <Bootstrap.CloseButton onClick={onClose} />
        </Bootstrap.Modal.Header>

        <Bootstrap.Modal.Body>
          <Bootstrap.Form>
            <Bootstrap.Form.Group className="mb-3" controlId="signup-email">
              <Bootstrap.Form.FloatingLabel controlId="floatingInput" label="Email">
                <Bootstrap.Form.Control type="email" placeholder="Enter email" />
              </Bootstrap.Form.FloatingLabel>
            </Bootstrap.Form.Group>

            <Bootstrap.Form.Group className="mb-3" controlId="signup-password">
              <Bootstrap.Form.FloatingLabel controlId="floatingInput" label="Password">
                <Bootstrap.Form.Control type="password" placeholder="Password" onChange={(e) => {
                  setEmail(e.target.value)
                }} />
              </Bootstrap.Form.FloatingLabel>
            </Bootstrap.Form.Group>

            <Bootstrap.Form.Group className="mb-3" controlId="signup-confirm-password">
              <Bootstrap.Form.FloatingLabel controlId="floatingInput" label="Confirm Password">
                <Bootstrap.Form.Control type="password" placeholder="Confirm Password" />
              </Bootstrap.Form.FloatingLabel>
            </Bootstrap.Form.Group>
          </Bootstrap.Form>

        </Bootstrap.Modal.Body>

        <Bootstrap.Modal.Footer>

          <Bootstrap.Form.Text className="text-muted">
            Already have an account? <a href="#" onClick={() => {
              onClose()
              openLogIn()
            }}>Log in</a>
          </Bootstrap.Form.Text>

          <Bootstrap.Button
            variant="primary"
            onClick={() => {

            }}>
            Create account
          </Bootstrap.Button>

        </Bootstrap.Modal.Footer>
      </Bootstrap.Modal>
    </>
  )
}