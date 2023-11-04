import * as Bootstrap from 'react-bootstrap'
import * as BootstrapIcon from 'react-bootstrap-icons'
import { useEffect, useState } from 'react'
import { Formik } from 'formik'
import classnames from 'classnames'
import axios from 'axios'
import * as yup from 'yup'

import MainNavbar from '$/comps/MainNavbar'
import LimanaFooter from '$/comps/LimanaFooter'
import AccountSideBar from '$/comps/AccountSideBar'
import { useAccount } from '$/comps/AccountContext'


function InspectViewItem({ label, editable, editMode, ...props }) {
  return (
    <>
      <Bootstrap.Form.Group>
        <Bootstrap.Container>
          <Bootstrap.Row className='p-2'>
            <Bootstrap.Col className="d-flex align-items-center" sm="3">
              <Bootstrap.Form.Label>{label}</Bootstrap.Form.Label>
            </Bootstrap.Col>
            <Bootstrap.Col>
              <Bootstrap.Form.Control disabled={!(editable && editMode)} {...props} />
            </Bootstrap.Col>
          </Bootstrap.Row>
        </Bootstrap.Container>
      </Bootstrap.Form.Group>
    </>
  )
}

function AccountInspectView({ userId }) {

  const [editMode, setEditMode] = useState(false)
  const [userData, setUserData] = useState(null)
  const validationSchema = yup.object({
    firstname: yup.string().required(),
    lastname: yup.string().required(),
    phone: yup.string(),
    address: yup.string(),
  })

  const { sessionToken, userEmail } = useAccount()

  const refreshUserData = () => {
    axios({
      method: 'get',
      url: '/api/userdata',
      headers: {
        'Limana-SessionId': sessionToken,
        'Limana-UserEmail': userEmail
      }
    }).then((response) => {
      setUserData(response.data.userdata)
    }).catch((error) => {
      console.log(error)
    })
  }

  useEffect(() => {
    if (!sessionToken || !userEmail) return
    if (editMode) return

    refreshUserData()
  }, [sessionToken, userEmail, editMode])

  return (
    <>
      {
        userData ? (
          <Formik
            initialValues={{
              firstname: userData.firstname,
              lastname: userData.lastname,
              phonenum: userData.phonenum,
              address: userData.address,
            }}
            onSubmit={(value) => {
              const formData = new FormData()
              formData.append('firstname', value.firstname)
              formData.append('lastname', value.lastname)
              formData.append('phonenum', value.phonenum)
              formData.append('address', value.address)

              axios({
                method: 'put',
                url: '/api/userdata',
                headers: {
                  'Limana-SessionId': sessionToken,
                  'Limana-UserEmail': userEmail
                },
                data: formData
              }).then(_ => {
                refreshUserData()
              }).catch((error) => {
                console.log(error)
              })
            }}>
            {({ handleSubmit, handleChange, values, touched, errors, handleBlur }) => (
              <Bootstrap.Container className="h-100" fluid>
                <Bootstrap.Row className="h-100">
                  {/* Side bar column */}
                  <Bootstrap.Col className="d-flex flex-column justify-content-center" sm="12" lg="5">
                    <AccountSideBar
                      userData={userData}
                      editable={true}
                      editMode={editMode}
                      setEditMode={setEditMode}
                      onSaveChanges={handleSubmit} />
                  </Bootstrap.Col>

                  {/* User inspector column */}
                  <Bootstrap.Col className="d-flex flex-column justify-content-center" sm="12" lg="7">

                    <Bootstrap.Row className="m-3 d-sm-none d-lg-inline">
                      <h2>Account center</h2>
                    </Bootstrap.Row>

                    <Bootstrap.Row>
                      <Bootstrap.Form>
                        <InspectViewItem
                          label='Email'
                          value={userEmail ?? ""}
                          editable={false} />

                        <InspectViewItem
                          label='First name'
                          id='firstname'
                          value={values.firstname ?? ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.firstname && errors.firstname}
                          editable={true}
                          editMode={editMode} />

                        <InspectViewItem
                          label='Last name'
                          id='lastname'
                          value={values.lastname ?? ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.lastname && errors.lastname}
                          editable={true}
                          editMode={editMode} />

                        <InspectViewItem
                          label='Phone number'
                          id='phonenum'
                          value={values.phonenum ?? ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          editable={true}
                          editMode={editMode} />

                        <InspectViewItem
                          label='Address'
                          id='address'
                          value={values.address ?? ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          editable={true}
                          editMode={editMode} />

                        <InspectViewItem
                          label='Role'
                          id='userrole'
                          value={userData.userrole ?? ""}
                          editable={false} />

                      </Bootstrap.Form>
                    </Bootstrap.Row>

                  </Bootstrap.Col>
                </Bootstrap.Row>
              </Bootstrap.Container>
            )}
          </Formik>
        ) : (
          <Bootstrap.Spinner animation="border" />
        )
      }
    </>
  )
}

function NoAccountView() {
  return (
    <>
      <Bootstrap.Col className='text-center'>
        <h1 className='display-1'>Who are you?</h1>
        <h2 className='display-6'>You need to login first</h2>
      </Bootstrap.Col>

      <Bootstrap.Col className='text-center'>
        <BootstrapIcon.PersonCircle size='100' />
      </Bootstrap.Col>
    </>
  )
}

export default function AccountView() {

  const { userData, sessionToken } = useAccount()

  return (
    <>
      <Bootstrap.Container className='vh-100 d-flex flex-column justify-content-between' fluid>
        <Bootstrap.Row className='justify-content-center align-items-center'>
          <Bootstrap.Col className='text-center'>
            <MainNavbar />
          </Bootstrap.Col>
        </Bootstrap.Row>


        <Bootstrap.Row className='justify-content-center align-items-center flex-grow-1'>
          {
            sessionToken ? (
              <AccountInspectView />
            ) : (
              <NoAccountView />
            )
          }
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