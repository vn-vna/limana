import * as Bootstrap from "react-bootstrap";
import * as BootstrapIcons from "react-bootstrap-icons";
import axios from "axios";
import {Formik} from "formik";
import {useEffect, useState} from "react";
import {useAccount} from "../comps/AccountContext.jsx";
import ManagerView from "./Manager.jsx";
import {useNavigate} from "react-router-dom";
import {useQuery} from "../comps/Query.jsx";

function PublisherManagerRow({name, id, refreshPublisherList}) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const {sessionToken, userData} = useAccount()

  return (
    <>
      <tr>
        <td>{name}</td>
        <td>
          <Bootstrap.ButtonGroup>
            <Bootstrap.Button variant="success" onClick={() => {
              setShowEditModal(true)
            }}>
              <BootstrapIcons.Pencil/>
            </Bootstrap.Button>
            <Bootstrap.Button variant="danger" onClick={() => {
              setShowDeleteModal(true)
            }}>
              <BootstrapIcons.Trash/>
            </Bootstrap.Button>
          </Bootstrap.ButtonGroup>
        </td>
      </tr>

      <Formik initialValues={{
        name: name
      }} onSubmit={(values) => {
        let form = new FormData()
        form.append("name", values.name)

        axios({
          method: 'put',
          url: `/api/publishers/${id}`,
          headers: {
            "Limana-SessionId": sessionToken,
            "Limana-UserEmail": userData?.email
          },
          data: form
        }).then((response) => {
          console.log(response)
          setShowEditModal(false)
          refreshPublisherList()
        }).catch((error) => {
          console.log(error)
        })
      }}>
        {({values, handleChange, handleSubmit}) => (
          <Bootstrap.Modal show={showEditModal}>
            <Bootstrap.Modal.Header>
              <Bootstrap.Modal.Title>Edit Publisher</Bootstrap.Modal.Title>
              <Bootstrap.CloseButton onClick={() => {
                setShowEditModal(false)
              }}/>
            </Bootstrap.Modal.Header>
            <Bootstrap.Modal.Body>
              <Bootstrap.Form.Control
                name="name"
                type="name"
                placeholder="Name"
                value={values.name}
                onChange={handleChange}/>
            </Bootstrap.Modal.Body>
            <Bootstrap.Modal.Footer>
              <Bootstrap.Button variant="primary" onClick={() => handleSubmit()}>Save changes</Bootstrap.Button>
            </Bootstrap.Modal.Footer>
          </Bootstrap.Modal>
        )}
      </Formik>

      <Formik initialValues={{
        name: name
      }} onSubmit={() => {
        axios({
          method: 'delete',
          url: `/api/publishers/${id}`,
          headers: {
            "Limana-SessionId": sessionToken,
            "Limana-UserEmail": userData?.email
          }
        }).then((response) => {
          console.log(response)
          setShowDeleteModal(false)
          refreshPublisherList()
        }).catch((error) => {
          console.log(error)
        })
      }}>
        {({values, handleChange, handleSubmit}) => (
          <Bootstrap.Modal show={showDeleteModal}>
            <Bootstrap.Modal.Header>
              <Bootstrap.Modal.Title>Delete Publisher</Bootstrap.Modal.Title>
              <Bootstrap.CloseButton onClick={() => {
                setShowDeleteModal(false)
              }}/>
            </Bootstrap.Modal.Header>
            <Bootstrap.Modal.Body>
              <Bootstrap.Form.Control
                name="name"
                type="name"
                placeholder="Name"
                disabled
                value={values.name}
                onChange={handleChange}/>
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

function FilterPublisherRow() {
  const navigate = useNavigate()
  const query = useQuery()
  return (
    <>
      <Formik initialValues={{
        name: query.get("name") || ""
      }} onSubmit={(values) => {
        let params = new URLSearchParams()
        params.set("name", values.name)

        navigate(`/admin/publishers?${params.toString()}`)
      }}>
        {({values, handleChange, handleSubmit, setValues}) => (
          <tr>
            <td>
              <Bootstrap.Form.Control
                value={values.name}
                onChange={handleChange}
                type="text"
                name="name"
                placeholder="Name"/>
            </td>
            <td>
              <Bootstrap.ButtonGroup>
                <Bootstrap.Button variant="primary" onClick={() => {
                  handleSubmit()
                }}>
                  <BootstrapIcons.Search/>
                </Bootstrap.Button>
                <Bootstrap.Button variant="danger" onClick={() => {
                  setValues({name: ""})
                  handleSubmit()
                }}>
                  <BootstrapIcons.Trash/>
                </Bootstrap.Button>
              </Bootstrap.ButtonGroup>
            </td>
          </tr>
        )}
      </Formik>
    </>
  )
}


export default function PublisherManagerView() {
  const [publisherList, setPublisherList] = useState([])
  const [showAddPublisherModal, setShowAddPublisherModal] = useState(false)
  const {sessionToken, userData} = useAccount()
  const query = useQuery()

  const refreshPublisherList = () => {
    axios({
      method: 'get',
      url: '/api/publishers',
      headers: {
        "Limana-SessionId": sessionToken,
        "Limana-UserEmail": userData?.email
      },
      params: {
        name: query.get("name") || ""
      }
    }).then((response) => {
      setPublisherList(response.data.publishers)
    }).catch((error) => {
      console.log(error)
    })
  }

  useEffect(() => {
    refreshPublisherList()
  }, [sessionToken, query])

  return (
    <>
      <ManagerView>
        <Bootstrap.Container fluid className="h-100">
          <Bootstrap.Row>
            <Bootstrap.Col>
              <h1>Publisher Manager</h1>
            </Bootstrap.Col>
          </Bootstrap.Row>
          <Bootstrap.Row>
            <Bootstrap.Col className="m-2 d-flex justify-content-end">
              <Bootstrap.Button variant="primary" onClick={() => setShowAddPublisherModal(true)}>
                Add Publisher
              </Bootstrap.Button>
            </Bootstrap.Col>
          </Bootstrap.Row>
          <Bootstrap.Row>
            <Bootstrap.Table striped bordered hover>
              <thead>
              <tr>
                <th>Name</th>
                <th>Actions</th>
              </tr>
              <FilterPublisherRow/>
              </thead>
              <tbody>
              {publisherList.map((publisher, index) => <PublisherManagerRow
                key={`${publisher.id}-${index}`}
                refreshPublisherList={refreshPublisherList} {...publisher} />)}
              </tbody>
            </Bootstrap.Table>
          </Bootstrap.Row>
        </Bootstrap.Container>
      </ManagerView>

      <Formik initialValues={{
        name: ""
      }} onSubmit={(values) => {
        let form = new FormData()
        form.append("name", values.name)

        axios({
          method: 'post',
          url: '/api/publishers',
          headers: {
            "Limana-SessionId": sessionToken,
            "Limana-UserEmail": userData?.email
          },
          data: form
        }).then((response) => {
          console.log(response)
          setShowAddPublisherModal(false)
          refreshPublisherList()
        }).catch((error) => {
          console.log(error)
        })
      }}>
        {
          ({values, handleChange, handleSubmit}) => (
            <Bootstrap.Modal show={showAddPublisherModal}>
              <Bootstrap.Modal.Header>
                <Bootstrap.Modal.Title>Add Publisher</Bootstrap.Modal.Title>
                <Bootstrap.CloseButton onClick={() => {
                  setShowAddPublisherModal(false)
                }}/>
              </Bootstrap.Modal.Header>
              <Bootstrap.Modal.Body>
                <Bootstrap.Form.Control
                  name="name"
                  type="name"
                  placeholder="Name"
                  value={values.name}
                  onChange={handleChange}/>
              </Bootstrap.Modal.Body>
              <Bootstrap.Modal.Footer>
                <Bootstrap.Button variant="primary" onClick={() => handleSubmit()}>Save changes</Bootstrap.Button>
              </Bootstrap.Modal.Footer>
            </Bootstrap.Modal>
          )
        }
      </Formik>
    </>
  )
}