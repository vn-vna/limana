import * as Bootstrap from 'react-bootstrap'
import { useState } from 'react'
import { Formik } from 'formik';

import { useModalControl } from '$/comps/MainNavbar'
import EmailInput from '$/comps/EmailInput'

export default function ForgotPasswordModal() {

  const { showForgotPasswordModal, setShowForgotPasswordModal, setShowLoginModal } = useModalControl()

  const [showRecoverKeyInput, setShowRecoverKeyInput] = useState(true)

  return (
    <>
      <Bootstrap.Modal show={showForgotPasswordModal} centered>
        <Bootstrap.Modal.Header>
          <Bootstrap.Modal.Title>Forgot Password</Bootstrap.Modal.Title>
          <Bootstrap.CloseButton onClick={() => {
            setShowForgotPasswordModal(false)
            setShowLoginModal(true)
          }} />
        </Bootstrap.Modal.Header>

        <Bootstrap.Modal.Body>
          <Formik
            initialValues={{
              email: "",
            }}
          >
            {({ handleSubmit, handleChange, values, touched, errors, handleBlur }) => (
              <Bootstrap.Form>
                <EmailInput
                  id="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  isValid={touched.email && values.email && !errors.email}
                  isInvalid={touched.email && !!errors.email}
                  overlay="Enter here the email you registered" />

                <Bootstrap.Form.Text className="text-muted">
                  We will send you a link to reset your password. Please check your email.
                </Bootstrap.Form.Text>

                <Bootstrap.Collapse in={showRecoverKeyInput}>
                  <Bootstrap.Form.Group className="mb-3">
                    <Bootstrap.FloatingLabel label="Recover key">
                      <Bootstrap.Form.Control type="text" placeholder="Enter recover key" />
                    </Bootstrap.FloatingLabel>
                  </Bootstrap.Form.Group>
                </Bootstrap.Collapse>
              </Bootstrap.Form>
            )}
          </Formik>
        </Bootstrap.Modal.Body>

        <Bootstrap.Modal.Footer>
          <Bootstrap.Button variant="primary" type="submit">
            Recover password
          </Bootstrap.Button>
        </Bootstrap.Modal.Footer>
      </Bootstrap.Modal>
    </>
  )
}