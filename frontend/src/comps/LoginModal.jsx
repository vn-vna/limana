import { useState } from 'react';
import { Formik } from 'formik';
import * as Bootstrap from 'react-bootstrap';
import * as yup from 'yup';
import axios from 'axios';

import { useModalControl } from '$/comps/MainNavbar';
import { useAccount } from '$/comps/AccountContext';
import EmailInput from '$/comps/EmailInput';
import PasswordInput from '$/comps/PasswordInput';

export default function LoginModal() {
  const validationSchema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
  })

  const { showLoginModal, setShowLoginModal, setShowSignupModal, setShowForgotPasswordModal } = useModalControl()
  const { setSessionToken } = useAccount()

  const [lastError, setLastError] = useState(null)

  return (
    <>
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={async (values) => {
          const formData = new FormData()
          formData.append('email', values.email)
          formData.append('password', values.password)

          try {
            const response = await axios({
              method: 'post',
              url: '/api/auth/login',
              data: formData,
              headers: { 'Content-Type': 'multipart/form-data' }
            })
            console.log(response.data)

            setSessionToken(response.data.sessionid)

            setLastError(null)
            setShowLoginModal(false)
          }
          catch (error) {
            console.log(error)
            setLastError(error.response.data.message)
          }
        }}>
        {({ handleSubmit, handleChange, values, touched, errors, handleBlur }) => (
          <Bootstrap.Modal show={showLoginModal} centered>
            <Bootstrap.Modal.Header>
              <Bootstrap.Modal.Title>Login</Bootstrap.Modal.Title>
              <Bootstrap.CloseButton onClick={() => {
                setShowLoginModal(false)
              }} />
            </Bootstrap.Modal.Header>

            <Bootstrap.Modal.Body>
              {
                lastError &&
                <Bootstrap.Alert variant="danger">
                  {lastError}
                </Bootstrap.Alert>
              }

              <Bootstrap.Form>
                <EmailInput
                  id="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isValid={touched.email && values.email && !errors.email}
                  isInvalid={touched.email && !!errors.email}
                  overlay="Enter here the email you registered" />

                <PasswordInput
                  id="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isValid={touched.password && values.password && !errors.password}
                  isInvalid={touched.password && !!errors.password}
                  overlay="Enter here the password you registered" />
              </Bootstrap.Form>

              <Bootstrap.Form.Text className="text-muted">
                Forgot your password? <a href="#" onClick={() => {
                  setShowLoginModal(false)
                  setShowForgotPasswordModal(true)
                }}>Reset it</a>
              </Bootstrap.Form.Text>

            </Bootstrap.Modal.Body>

            <Bootstrap.Modal.Footer>
              <Bootstrap.Form.Text className="text-muted">
                Don't have an account? <a href="#" onClick={() => {
                  setShowLoginModal(false)
                  setShowSignupModal(true)
                }}>Sign up</a>
              </Bootstrap.Form.Text>
              <Bootstrap.Button variant="primary" type="submit" onClick={handleSubmit}>
                Get in
              </Bootstrap.Button>
            </Bootstrap.Modal.Footer>
          </Bootstrap.Modal>
        )}
      </Formik>
    </>
  )
}