import { useState } from 'react';
import { Formik } from 'formik';
import * as Bootstrap from 'react-bootstrap';
import * as BootstrapIcon from 'react-bootstrap-icons';
import * as yup from 'yup';
import axios from 'axios';

import { useModalControl } from '$/comps/MainNavbar';
import EmailInput from '$/comps/EmailInput';
import PasswordInput from './PasswordInput';

export default function SignupModal() {
  const validationSchema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match'),
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    phoneNumber: yup.string().matches(/^[0-9]*$/, 'Phone number is not valid'),
    birthday: yup.string(),
    address: yup.string(),
  })


  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [needSignup, setNeedSignup] = useState(true)
  const [lastError, setLastError] = useState(null)

  const { showSignupModal, setShowSignupModal, setShowLoginModal } = useModalControl()

  return (
    <>
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          email: "",
          password: "",
          confirmPassword: "",
          firstName: "",
          lastName: "",
          phoneNumber: "",
          birthday: "",
          address: "",
        }} onSubmit={async (values) => {
          const formData = new FormData()
          formData.append('email', values.email)
          formData.append('password', values.password)
          formData.append('firstname', values.firstName)
          formData.append('lastname', values.lastName)
          formData.append('phonenum', values.phoneNumber)
          formData.append('birthday', values.birthday)
          formData.append('address', values.address)

          try {

            const response = await axios({
              method: 'post',
              url: '/api/auth/signup',
              data: formData,
              headers: { 'Content-Type': 'multipart/form-data' }
            })

            setLastError(null)
            console.log(response)
            setNeedSignup(false)
          } catch (error) {
            console.log(error)
            setLastError(error.response.data.message)
          }
        }}>
        {({ handleSubmit, handleChange, values, touched, errors, handleBlur }) => (
          <Bootstrap.Modal show={showSignupModal} centered>
              <Bootstrap.Modal.Header>
                <Bootstrap.Modal.Title>Sign Up</Bootstrap.Modal.Title>
                <Bootstrap.CloseButton onClick={() => {
                  setShowSignupModal(false)
                }} />
              </Bootstrap.Modal.Header>

              <Bootstrap.Modal.Body>
                {
                  lastError &&
                  <Bootstrap.Alert variant="danger">
                    {lastError}
                  </Bootstrap.Alert>
                }

                {
                  !needSignup &&
                  <Bootstrap.Alert variant="success">
                    Sign up successfully!
                  </Bootstrap.Alert>
                }

                <Bootstrap.Form>
                  <EmailInput
                    id="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    overlay="Email is used for login and reseting password"
                    isValid={touched.email && values.email && !errors.email}
                    isInvalid={touched.email && !!errors.email} />

                  <PasswordInput
                    id="password"
                    value={values.password}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    isValid={touched.password && !errors.password}
                    isInvalid={touched.password && !!errors.password}
                    overlay="Password must be at least 8 characters long" />

                  <PasswordInput
                    id="confirmPassword"
                    value={values.confirmPassword}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    isValid={values.confirmPassword && !errors.confirmPassword}
                    isInvalid={!!errors.confirmPassword}
                    overlay="Confirm your password again"
                    label="Confirm password" />

                  <Bootstrap.Collapse in={showMoreOptions}>
                    <div>
                      <Bootstrap.Form.Group className="mb-3">
                        <Bootstrap.Form.FloatingLabel label="First name">
                          <Bootstrap.Form.Control
                            id="firstName"
                            value={values.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isValid={touched.firstName && values.firstName && !errors.firstName}
                            isInvalid={touched.firstName && !!errors.firstName}
                            type="text"
                            placeholder="Enter first name" />
                        </Bootstrap.Form.FloatingLabel>
                      </Bootstrap.Form.Group>

                      <Bootstrap.Form.Group className="mb-3">
                        <Bootstrap.Form.FloatingLabel label="Last name">
                          <Bootstrap.Form.Control
                            id="lastName"
                            value={values.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isValid={touched.lastName && values.lastName && !errors.lastName}
                            isInvalid={touched.lastName && !!errors.lastName}
                            type="text"
                            placeholder="Enter last name" />
                        </Bootstrap.Form.FloatingLabel>
                      </Bootstrap.Form.Group>

                      <Bootstrap.Form.Group className="mb-3">
                        <Bootstrap.Form.FloatingLabel label="Phone number">
                          <Bootstrap.Form.Control
                            id="phoneNumber"
                            value={values.phoneNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isValid={touched.phoneNumber && values.phoneNumber && !errors.phoneNumber}
                            isInvalid={touched.phoneNumber && !!errors.phoneNumber}
                            type="text"
                            placeholder="Enter phone number" />
                        </Bootstrap.Form.FloatingLabel>

                        <Bootstrap.Form.Text className="text-muted">
                          We'll never share your phone number with anyone else.
                        </Bootstrap.Form.Text>
                      </Bootstrap.Form.Group>

                      <Bootstrap.Form.Group className="mb-3">
                        <Bootstrap.Form.FloatingLabel label="Adress">
                          <Bootstrap.Form.Control
                            id="address"
                            value={values.address}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            type="text"
                            placeholder="Enter address" />
                        </Bootstrap.Form.FloatingLabel>
                      </Bootstrap.Form.Group>

                      <Bootstrap.Form.Group className="mb-3">
                        <Bootstrap.Form.FloatingLabel label="Birthday">
                          <Bootstrap.Form.Control
                            id="birthday"
                            value={values.birthday}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            type="date"
                            placeholder="Enter birthday" />
                        </Bootstrap.Form.FloatingLabel>
                      </Bootstrap.Form.Group>
                    </div>
                  </Bootstrap.Collapse>

                  <Bootstrap.Form.Group>
                    <Bootstrap.Form.Check
                      type="checkbox"
                      label="Show more sign in options"
                      onChange={(e) => { setShowMoreOptions(e?.target.checked) }}
                      checked={showMoreOptions}
                    />
                  </Bootstrap.Form.Group>

                  <Bootstrap.Form.Group>
                    <Bootstrap.Form.Check
                      type="checkbox"
                      label="I agree to the Terms of Service and Privacy Policy"
                    />
                  </Bootstrap.Form.Group>
                </Bootstrap.Form>

              </Bootstrap.Modal.Body>

              <Bootstrap.Modal.Footer>

                <Bootstrap.Form.Text className="text-muted">
                  Already have an account? <a href="#" onClick={() => {
                    setShowSignupModal(false)
                    setShowLoginModal(true)
                  }}>Log in</a>
                </Bootstrap.Form.Text>

                <Bootstrap.Button
                  variant="primary"
                  onClick={() => {
                    if (errors.firstName || errors.lastName) {
                      setShowMoreOptions(true)
                      return
                    }

                    handleSubmit()
                  }}>
                  Create account
                </Bootstrap.Button>

              </Bootstrap.Modal.Footer>
          </Bootstrap.Modal>
        )}
      </Formik>
    </>
  )
}