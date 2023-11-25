import * as Bootstrap from "react-bootstrap";
import * as BootstrapIcons from "react-bootstrap-icons";

import ManagerView from "./Manager.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAccount } from "../comps/AccountContext.jsx";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { useQuery } from "../comps/Query.jsx";

function AuthorManagerRow({ id, firstname, lastname, address, phonenum, refreshAuthorList }) {

  const [showEditAuthorModal, setShowEditAuthorModal] = useState(false)
  const [showDeleteAuthorModal, setShowDeleteAuthorModal] = useState(false)
  const { sessionToken, userEmail } = useAccount()

  return (
    <>
      <tr>
        <td>{firstname}</td>
        <td>{lastname}</td>
        <td>{address}</td>
        <td>{phonenum}</td>
        <td>
          <Bootstrap.ButtonGroup>
            <Bootstrap.Button variant="success" onClick={() => setShowEditAuthorModal(true)}>
              <BootstrapIcons.Pencil />
            </Bootstrap.Button>
            <Bootstrap.Button variant="danger" onClick={() => setShowDeleteAuthorModal(true)}>
              <BootstrapIcons.Trash />
            </Bootstrap.Button>
          </Bootstrap.ButtonGroup>
        </td>
      </tr>

      <Formik initialValues={{
        firstname: firstname,
        lastname: lastname,
        address: address,
        phonenum: phonenum
      }} onSubmit={(values) => {
        let form = new FormData()
        form.append("firstname", values.firstname)
        form.append("lastname", values.lastname)
        form.append("address", values.address)
        form.append("phonenum", values.phonenum)

        axios({
          method: 'put',
          url: `/api/authors/${id}`,
          headers: {
            "Limana-SessionID": sessionToken,
            "Limana-UserEmail": userEmail
          },
          data: form
        }).then((response) => {
          console.log(response)
          setShowEditAuthorModal(false)
          refreshAuthorList()
        }).catch((error) => {
          console.log(error)
        })
      }}>
        {({ values, handleChange, handleBlur, handleSubmit, resetForm }) => (
          <Bootstrap.Modal show={showEditAuthorModal}>
            <Bootstrap.Modal.Header>
              <Bootstrap.Modal.Title>Edit author</Bootstrap.Modal.Title>
              <Bootstrap.CloseButton onClick={() => setShowEditAuthorModal(false)} />
            </Bootstrap.Modal.Header>

            <Bootstrap.Modal.Body>
              <Bootstrap.Form>
                <Bootstrap.Form.Group>
                  <Bootstrap.Form.Label>Firstname</Bootstrap.Form.Label>
                  <Bootstrap.Form.Control
                    value={values.firstname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="firstname"
                    placeholder="Firstname" />
                </Bootstrap.Form.Group>

                <Bootstrap.Form.Group>
                  <Bootstrap.Form.Label>Lastname</Bootstrap.Form.Label>
                  <Bootstrap.Form.Control
                    value={values.lastname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="lastname"
                    placeholder="Lastname" />
                </Bootstrap.Form.Group>

                <Bootstrap.Form.Group>
                  <Bootstrap.Form.Label>Address</Bootstrap.Form.Label>
                  <Bootstrap.Form.Control
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="address"
                    placeholder="Address" />
                </Bootstrap.Form.Group>

                <Bootstrap.Form.Group>
                  <Bootstrap.Form.Label>Phone</Bootstrap.Form.Label>
                  <Bootstrap.Form.Control
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="phonenum"
                    placeholder="Phone number" />
                </Bootstrap.Form.Group>
              </Bootstrap.Form>

            </Bootstrap.Modal.Body>

            <Bootstrap.Modal.Footer>
              <Bootstrap.Button variant="primary" onClick={() => handleSubmit()}>Save changes</Bootstrap.Button>
            </Bootstrap.Modal.Footer>
          </Bootstrap.Modal>
        )}
      </Formik>

      <Formik initialValues={{}} onSubmit={(values) => {
        axios({
          method: 'delete',
          url: `/api/authors/${id}`,
          headers: {
            "Limana-SessionID": sessionToken,
            "Limana-UserEmail": userEmail
          }
        }).then((response) => {
          console.log(response)
          setShowDeleteAuthorModal(false)
          refreshAuthorList()
        }).catch((error) => {
          console.log(error)
        })
      }}>
        {({ handleSubmit }) => (
          <Bootstrap.Modal show={showDeleteAuthorModal}>
            <Bootstrap.Modal.Header>
              <Bootstrap.Modal.Title>Delete author</Bootstrap.Modal.Title>
              <Bootstrap.CloseButton onClick={() => setShowDeleteAuthorModal(false)} />
            </Bootstrap.Modal.Header>

            <Bootstrap.Modal.Body>
              <Bootstrap.Form>
                <Bootstrap.Form.Group>
                  <Bootstrap.Form.Label>Firstname</Bootstrap.Form.Label>
                  <Bootstrap.Form.Control
                    value={firstname}
                    disabled
                    name="firstname"
                    placeholder="Firstname" />
                </Bootstrap.Form.Group>

                <Bootstrap.Form.Group>
                  <Bootstrap.Form.Label>Lastname</Bootstrap.Form.Label>
                  <Bootstrap.Form.Control
                    value={lastname}
                    disabled
                    name="lastname"
                    placeholder="Lastname" />
                </Bootstrap.Form.Group>

                <Bootstrap.Form.Group>
                  <Bootstrap.Form.Label>Address</Bootstrap.Form.Label>
                  <Bootstrap.Form.Control
                    value={address}
                    disabled
                    name="address"
                    placeholder="Address" />
                </Bootstrap.Form.Group>

                <Bootstrap.Form.Group>
                  <Bootstrap.Form.Label>Phone</Bootstrap.Form.Label>
                  <Bootstrap.Form.Control
                    value={phonenum}
                    disabled
                    name="phonenum"
                    placeholder="Phone number" />
                </Bootstrap.Form.Group>
              </Bootstrap.Form>

            </Bootstrap.Modal.Body>

            <Bootstrap.Modal.Footer>
              <Bootstrap.Button variant="danger" onClick={() => handleSubmit()}>Delete</Bootstrap.Button>
            </Bootstrap.Modal.Footer>

          </Bootstrap.Modal>
        )}
      </Formik>
    </>
  )
}

function FilterAuthorRow() {
  const navigate = useNavigate()
  const query = useQuery()

  return (
    <Formik initialValues={{
      name: query.get("name") ?? "",
      address: query.get("address") ?? "",
      phonenum: query.get("phonenum") ?? ""
    }} onSubmit={(values) => {
      let query = new URLSearchParams()
      values.name && query.set("name", values.name)
      values.address && query.set("address", values.address)
      values.phonenum && query.set("phonenum", values.phonenum)

      console.log(query.toString())

      let uri = `/admin/authors?${query.toString()}`
      navigate(uri)
    }}>
      {({ values, handleChange, setValues, handleBlur, handleSubmit, resetForm }) => (
        <tr>
          <td colSpan={2}>
            <Bootstrap.Form.Control
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              name="name"
              placeholder="Filter by name" />
          </td>
          <td>
            <Bootstrap.Form.Control
              value={values.address}
              onChange={handleChange}
              onBlur={handleBlur}
              name="address" placeholder="Filter address" />
          </td>
          <td>
            <Bootstrap.Form.Control
              value={values.phonenum}
              onChange={handleChange}
              onBlur={handleBlur}
              name="phonenum" placeholder="Filter phone" />
          </td>
          <td>
            <Bootstrap.ButtonGroup>
              <Bootstrap.Button variant="primary" onClick={() => handleSubmit()}>
                <BootstrapIcons.Search />
              </Bootstrap.Button>
              <Bootstrap.Button variant="danger" onClick={() => {
                setValues({
                  firstname: "",
                  lastname: "",
                  address: "",
                  phonenum: ""
                })
                handleSubmit()
              }}>
                <BootstrapIcons.Trash />
              </Bootstrap.Button>
            </Bootstrap.ButtonGroup>
          </td>
        </tr>
      )}
    </Formik>
  )
}

export default function AuthorManagerView() {
  const [authorList, setAuthorList] = useState([])
  const { sessionToken, userEmail } = useAccount()
  const [showAddAuthorModal, setShowAddAuthorModal] = useState(false)
  const query = useQuery()

  const reloadAuthorList = () => {
    if (!sessionToken) {
      return
    }

    axios.get("/api/authors", {
      headers: {
        "Limana-UserEmail": userEmail,
        "Limana-SessionID": sessionToken
      },
      params: {
        name: query.get("name"),
        address: query.get("address"),
        phonenum: query.get("phonenum")
      }
    }).then((response) => {
      setAuthorList(response.data.authors)
    }).catch((error) => {
      console.log(error)
    })
  }

  useEffect(() => {
    reloadAuthorList()
  }, [sessionToken, query])

  return (
    <>
      <ManagerView>
        <Bootstrap.Container fluid className="h-100">
          <Bootstrap.Row>
            <h1>Author Manager</h1>
          </Bootstrap.Row>
          <Bootstrap.Row>
            <Bootstrap.Col className="m-2 d-flex justify-content-end">
              <Bootstrap.ButtonGroup>
                <Bootstrap.Button variant="primary" onClick={() => setShowAddAuthorModal(true)}>
                  Add author
                </Bootstrap.Button>
              </Bootstrap.ButtonGroup>
            </Bootstrap.Col>
          </Bootstrap.Row>
          <Bootstrap.Row>
            <Bootstrap.Col>

              <Bootstrap.Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Firstname</th>
                    <th>Lastname</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                  <FilterAuthorRow />
                </thead>
                <tbody>
                  {authorList.map((author, index) => <AuthorManagerRow key={`${author.id}--${index}`} refreshAuthorList={reloadAuthorList} {...author} />)}
                </tbody>
              </Bootstrap.Table>

            </Bootstrap.Col>
          </Bootstrap.Row>
        </Bootstrap.Container>

      </ManagerView>

      <Formik initialValues={{
        firstname: "",
        lastname: "",
        address: "",
        phonenum: ""
      }} onSubmit={(values, { resetForm }) => {
        let form = new FormData()
        form.append("firstname", values.firstname)
        form.append("lastname", values.lastname)
        form.append("address", values.address)
        form.append("phonenum", values.phonenum)

        axios({
          method: 'post',
          url: '/api/authors',
          headers: {
            "Limana-SessionID": sessionToken,
            "Limana-UserEmail": userEmail
          },
          data: form
        }).then((response) => {
          console.log(response)
          setShowAddAuthorModal(false)
          reloadAuthorList()
        }).catch((error) => {
          console.log(error)
        })
        resetForm()
      }}>
        {({ values, handleChange, handleBlur, handleSubmit, resetForm }) => (
          <Bootstrap.Modal show={showAddAuthorModal}>
            <Bootstrap.Modal.Header>
              <Bootstrap.Modal.Title>Add author</Bootstrap.Modal.Title>
              <Bootstrap.CloseButton onClick={() => setShowAddAuthorModal(false)} />
            </Bootstrap.Modal.Header>

            <Bootstrap.Modal.Body>
              <Bootstrap.Form>
                <Bootstrap.Form.Group>
                  <Bootstrap.Form.Label>Firstname</Bootstrap.Form.Label>
                  <Bootstrap.Form.Control
                    value={values.firstname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="firstname"
                    placeholder="Firstname" />
                </Bootstrap.Form.Group>

                <Bootstrap.Form.Group>
                  <Bootstrap.Form.Label>Lastname</Bootstrap.Form.Label>
                  <Bootstrap.Form.Control
                    value={values.lastname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="lastname"
                    placeholder="Lastname" />
                </Bootstrap.Form.Group>

                <Bootstrap.Form.Group>
                  <Bootstrap.Form.Label>Address</Bootstrap.Form.Label>
                  <Bootstrap.Form.Control
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="address"
                    placeholder="Address" />
                </Bootstrap.Form.Group>

                <Bootstrap.Form.Group>
                  <Bootstrap.Form.Label>Phone</Bootstrap.Form.Label>
                  <Bootstrap.Form.Control
                    value={values.phonenum}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="phonenum"
                    placeholder="Phone" />
                </Bootstrap.Form.Group>
              </Bootstrap.Form>

            </Bootstrap.Modal.Body>

            <Bootstrap.Modal.Footer>
              <Bootstrap.Button variant="primary" onClick={() => handleSubmit()}>Save changes</Bootstrap.Button>
            </Bootstrap.Modal.Footer>
          </Bootstrap.Modal>
        )}
      </Formik>
    </>
  )
}
