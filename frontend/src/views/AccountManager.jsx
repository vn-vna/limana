import ManagerView from "./Manager.jsx";
import * as Bootstrap from "react-bootstrap";
import * as BootstrapIcons from "react-bootstrap-icons";
import { useEffect, useState } from "react";
import { useAccount } from "../comps/AccountContext.jsx";
import axios from "axios";
import { useQuery } from "../comps/Query.jsx";
import { Formik } from "formik";

function FormUserDetails({ email, firstname, lastname, role, onHide, mode, isShown }) {
  let initialValues = null;
  let title = null;

  switch (mode) {
    case "add":
      initialValues = {
        email: "",
        firstname: "",
        lastname: "",
        role: ""
      }
      title = "Add user"
      break;
    case "edit":
      initialValues = {
        email: email,
        firstname: firstname,
        lastname: lastname,
        role: role
      }
      title = "Edit user"
      break;
    case "delete":
      initialValues = {
        email: email,
        firstname: firstname,
        lastname: lastname,
        role: role
      }
      title = "Delete user"
      break;
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {

      }}>
      {
        ({ values, handleChange, handleSubmit }) => (
          <Bootstrap.Modal show={isShown} onHide={onHide}>
            <Bootstrap.Modal.Header closeButton>
              <Bootstrap.Modal.Title>{title}</Bootstrap.Modal.Title>
            </Bootstrap.Modal.Header>
            <Bootstrap.Modal.Body>
              <Bootstrap.Form>
                <Bootstrap.Form.Group controlId="email">
                  <Bootstrap.Form.Label>Email</Bootstrap.Form.Label>
                  <Bootstrap.Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={values.email}
                    onChange={handleChange}
                  />
                </Bootstrap.Form.Group>
                <Bootstrap.Form.Group controlId="firstname">
                  <Bootstrap.Form.Label>Firstname</Bootstrap.Form.Label>
                  <Bootstrap.Form.Control
                    type="text"
                    placeholder="Enter firstname"
                    value={values.firstname}
                    onChange={handleChange}
                  />
                </Bootstrap.Form.Group>
                <Bootstrap.Form.Group controlId="lastname">
                  <Bootstrap.Form.Label>Lastname</Bootstrap.Form.Label>
                  <Bootstrap.Form.Control
                    type="text"
                    placeholder="Enter lastname"
                    value={values.lastname}
                    onChange={handleChange}
                  />
                </Bootstrap.Form.Group>
                <Bootstrap.Form.Group controlId="role">
                  <Bootstrap.Form.Label>Role</Bootstrap.Form.Label>
                  <Bootstrap.Form.Select onChange={handleChange} value={values.role}>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </Bootstrap.Form.Select>
                </Bootstrap.Form.Group>
              </Bootstrap.Form>
            </Bootstrap.Modal.Body>
            <Bootstrap.Modal.Footer>
              <Bootstrap.Button variant="secondary" onClick={onHide}>
                Close
              </Bootstrap.Button>
              <Bootstrap.Button variant="primary" onClick={handleSubmit}>
                Save Changes
              </Bootstrap.Button>
            </Bootstrap.Modal.Footer>
          </Bootstrap.Modal>
        )
      }
    </Formik>
  )
}


function AccountManagerRow({ email, role, firstname, lastname }) {
  return (
    <tr>
      <td>{email}</td>
      <td>{firstname}</td>
      <td>{lastname}</td>
      <td>{role}</td>
      <td>
        <Bootstrap.ButtonGroup>
          <Bootstrap.Button variant="success">
            <BootstrapIcons.Pencil />
          </Bootstrap.Button>
          <Bootstrap.Button variant="danger">
            <BootstrapIcons.Trash />
          </Bootstrap.Button>
        </Bootstrap.ButtonGroup>
      </td>
    </tr>
  )
}

function FilterUserRow() {
  return (
    <tr>
      <td>
        <Bootstrap.Form.Control type="email" placeholder="Email" />
      </td>
      <td>
        <Bootstrap.Form.Control type="text" placeholder="Firstname" />
      </td>
      <td>
        <Bootstrap.Form.Control type="text" placeholder="Lastname" />
      </td>
      <td>
        <Bootstrap.Form.Control type="text" placeholder="Role" />
      </td>
      <td>
        <Bootstrap.ButtonGroup>
          <Bootstrap.Button variant="primary">
            <BootstrapIcons.Search />
          </Bootstrap.Button>
          <Bootstrap.Button variant="danger">
            <BootstrapIcons.Trash />
          </Bootstrap.Button>
        </Bootstrap.ButtonGroup>
      </td>
    </tr>
  )
}

function AddUserRow() {
  return (
    <tr>
      <td>
        <Bootstrap.Form.Control type="email" placeholder="Email" />
      </td>
      <td>
        <Bootstrap.Form.Control type="text" placeholder="Firstname" />
      </td>
      <td>
        <Bootstrap.Form.Control type="text" placeholder="Lastname" />
      </td>
      <td>
        <Bootstrap.Form.Control type="text" placeholder="Role" />
      </td>
      <td>
        <Bootstrap.ButtonGroup>
          <Bootstrap.Button variant="success">
            <BootstrapIcons.Plus />
          </Bootstrap.Button>
          <Bootstrap.Button variant="danger">
            <BootstrapIcons.Trash />
          </Bootstrap.Button>
        </Bootstrap.ButtonGroup>
      </td>
    </tr>
  )
}

export default function AccountManagerView() {
  const query = useQuery()
  const [userList, setUserList] = useState([])
  const [isAddUserShown, setIsAddUserShown] = useState(false)
  const { sessionToken, userEmail } = useAccount()

  useEffect(() => {
    axios({
      method: 'get',
      url: '/api/userdata/all',
      headers: {
        "Limana-SessionID": sessionToken,
        "Limana-UserEmail": userEmail
      },
      params: {
        email: query.get("email"),
        firstname: query.get("firstname"),
        lastname: query.get("lastname"),
        role: query.get("role")
      }
    }).then((response) => {
      setUserList(response.data.users)
    }).catch((error) => {
      console.log(error)
    })

  }, [sessionToken, query])

  return (
    <>
      <ManagerView>
        <Bootstrap.Container fluid className="h-100">
          <h1>Account Manager</h1>
          <Bootstrap.Row className="m-2">
            <Bootstrap.Col className="d-flex justify-content-end">
              <Bootstrap.ButtonGroup>
                <Bootstrap.Button
                  onClick={() => setIsAddUserShown(true)}
                  variant="success">
                  Add user
                </Bootstrap.Button>
              </Bootstrap.ButtonGroup>
            </Bootstrap.Col>
          </Bootstrap.Row>
          <Bootstrap.Table striped bordered hover>
            <thead>
              <tr>
                <th>Username</th>
                <th>Fistname</th>
                <th>Lastname</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <FilterUserRow />
              {
                userList.map((user, index) => {
                  return (
                    <AccountManagerRow
                      key={index}
                      email={user.email}
                      firstname={user.firstname}
                      lastname={user.lastname}
                      role={user.userrole}
                    />
                  )
                })
              }
            </tbody>
          </Bootstrap.Table>
        </Bootstrap.Container>
      </ManagerView>

      <FormUserDetails mode="add" isShown={isAddUserShown} onHide={() => setIsAddUserShown(false)} />
    </>
  )
}