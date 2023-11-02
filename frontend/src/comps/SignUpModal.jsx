import { useState } from 'react';
import { Formik } from 'formik';
import * as Bootstrap from 'react-bootstrap';
import * as BootstrapIcon from 'react-bootstrap-icons';
import * as yup from 'yup';

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
    phoneNumber: yup.string().required(),
    birthday: yup.date().required(),
  })


  const [showMoreOptions, setShowMoreOptions] = useState(false)

  const { showSignupModal, setShowSignupModal, setShowLoginModal } = useModalControl()

  return (
    <>
      <Bootstrap.Modal show={showSignupModal} centered>
        <Bootstrap.Modal.Header>
          <Bootstrap.Modal.Title>Sign Up</Bootstrap.Modal.Title>
          <Bootstrap.CloseButton onClick={() => {
            setShowSignupModal(false)
          }} />
        </Bootstrap.Modal.Header>

        <Bootstrap.Modal.Body>
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
            }}>
            {({ handleSubmit, handleChange, values, touched, errors, handleBlur }) => (
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
                    <Bootstrap.Form.Group className="mb-3" controlId="first-name">
                      <Bootstrap.Form.FloatingLabel controlId="floatingFirstNameInput" label="First name">
                        <Bootstrap.Form.Control type="text" placeholder="Enter first name" />
                      </Bootstrap.Form.FloatingLabel>
                    </Bootstrap.Form.Group>

                    <Bootstrap.Form.Group className="mb-3" controlId="last-name">
                      <Bootstrap.Form.FloatingLabel controlId="floatingLastNameInput" label="Last name">
                        <Bootstrap.Form.Control type="text" placeholder="Enter last name" />
                      </Bootstrap.Form.FloatingLabel>
                    </Bootstrap.Form.Group>

                    <Bootstrap.Form.Group className="mb-3" controlId="phone-number">
                      <Bootstrap.Form.FloatingLabel controlId="floatingPhoneNumberInput" label="Phone number">
                        <Bootstrap.Form.Control type="text" placeholder="Enter phone number" />
                      </Bootstrap.Form.FloatingLabel>

                      <Bootstrap.Form.Text className="text-muted">
                        We'll never share your phone number with anyone else.
                      </Bootstrap.Form.Text>
                    </Bootstrap.Form.Group>

                    <Bootstrap.Form.Group className="mb-3" controlId="birthday">
                      <Bootstrap.Form.FloatingLabel controlId="floatingBirthdayInput" label="Birthday">
                        <Bootstrap.Form.Control type="date" placeholder="Enter birthday" />
                      </Bootstrap.Form.FloatingLabel>
                    </Bootstrap.Form.Group>
                  </div>
                </Bootstrap.Collapse>

                <Bootstrap.Form.Group>
                  <Bootstrap.Form.Check
                    type="checkbox"
                    label="Show more sign in options"
                    onChange={(e) => { setShowMoreOptions(e?.target.checked) }}
                    value={showMoreOptions}
                  />
                </Bootstrap.Form.Group>

                <Bootstrap.Form.Group>
                  <Bootstrap.Form.Check
                    type="checkbox"
                    label="I agree to the Terms of Service and Privacy Policy"
                  />
                </Bootstrap.Form.Group>
              </Bootstrap.Form>

            )}
          </Formik>
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

            }}>
            Create account
          </Bootstrap.Button>

        </Bootstrap.Modal.Footer>
      </Bootstrap.Modal>
    </>
  )
}