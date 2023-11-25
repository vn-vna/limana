import ManagerView from "./Manager.jsx";
import * as Bootstrap from "react-bootstrap";
import { Container } from "react-bootstrap";
import * as BootstrapIcons from "react-bootstrap-icons";
import { useEffect, useState } from "react";
import { useAccount } from "../comps/AccountContext.jsx";
import { useQuery } from "../comps/Query.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";

function isValidDateString(d) {
  return !isNaN(new Date(d));
}

function convertDateToDateString(d) {
  return new Date(d).toISOString().split("T")[0]
}

function FormBookDetail({ isShown, onSubmit, onHide, bookData, mode }) {

  const { sessionToken, userData } = useAccount()
  let initialValues = null
  let modalTitle = null

  switch (mode) {
    case "add":
      initialValues = {
        title: "",
        authorid: "",
        publisherid: "",
        published: new Date(),
        instore: 0
      }
      modalTitle = "Add Book"
      break

    case "edit":
      initialValues = { ...bookData }
      modalTitle = "Edit Book"
      break;

    case "delete":
      initialValues = { ...bookData }
      modalTitle = "Delete Book"
      break;
  }

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {
        ({ values, handleChange, handleSubmit, setValues }) => {
          const [showAuthorDropdown, setShowAuthorDropdown] = useState(false)
          const [showPublisherDropdown, setShowPublisherDropdown] = useState(false)
          const [authorList, setAuthorList] = useState([])
          const [publisherList, setPublisherList] = useState([])
          const [authorSearch, setAuthorSearch] = useState("")
          const [publisherSearch, setPublisherSearch] = useState("")


          // Refresh author list when authorSearch changes
          useEffect(() => {
            if (mode == "delete") return
            if (!isShown) return

            axios({
              method: 'get',
              url: '/api/authors',
              params: {
                name: authorSearch
              }
            }).then((response) => {
              setAuthorList(response.data.authors)
            }).catch((error) => {
              console.log(error)
            })
          }, [authorSearch])

          // Refresh publisher list when publisherSearch changes
          useEffect(() => {
            if (mode == "delete") return
            if (!isShown) return

            axios({
              method: 'get',
              url: '/api/publishers',
              params: {
                name: publisherSearch
              }
            }).then((response) => {
              setPublisherList(response.data.publishers)
            }).catch((error) => {
              console.log(error)
            })
          }, [publisherSearch])

          return (
            <Bootstrap.Modal show={isShown} onHide={onHide}>

              <Bootstrap.Modal.Header closeButton>
                <Bootstrap.Modal.Title>{modalTitle}</Bootstrap.Modal.Title>
              </Bootstrap.Modal.Header>

              <Bootstrap.Modal.Body>
                <Bootstrap.Form>

                  <Bootstrap.Form.Group>
                    <Bootstrap.Form.Label>Name</Bootstrap.Form.Label>
                    <Bootstrap.Form.Control
                      disabled={mode === "delete"}
                      onChange={handleChange}
                      name="title"
                      value={values.title}
                      type="text"
                      placeholder="Book Name" />
                  </Bootstrap.Form.Group>

                  <Bootstrap.Form.Group>
                    <Bootstrap.Form.Label>Author</Bootstrap.Form.Label>
                    <Bootstrap.Form.Control
                      disabled={mode === "delete"}
                      type="text"
                      placeholder="Author"
                      onChange={(e) => setAuthorSearch(e.target.value)}
                      value={authorSearch}
                      onFocus={() => setShowAuthorDropdown(true)}
                      onBlur={() => setShowAuthorDropdown(false)} />
                    <Bootstrap.DropdownMenu show={showAuthorDropdown}>
                      {
                        authorList.map((author, index) => {
                          const name = `${author.firstname} ${author.lastname}`.trim()
                          return (
                            <Bootstrap.Dropdown.Item
                              key={`${author.firstname}-${author.id}-${index}`}
                              as={"div"} onMouseDown={() => {
                                setAuthorSearch(name)
                                setValues({ ...values, authorid: author.id })
                              }}>
                              {name}
                            </Bootstrap.Dropdown.Item>
                          )
                        })
                      }
                    </Bootstrap.DropdownMenu>
                  </Bootstrap.Form.Group>

                  <Bootstrap.Form.Group>
                    <Bootstrap.Form.Label>Publisher</Bootstrap.Form.Label>
                    <Bootstrap.Form.Control
                      disabled={mode === "delete"}
                      onChange={(e) => setPublisherSearch(e.target.value)}
                      value={publisherSearch}
                      onFocus={() => setShowPublisherDropdown(true)}
                      onBlur={() => setShowPublisherDropdown(false)}
                      type="text" placeholder="Publisher" />
                    <Bootstrap.DropdownMenu show={showPublisherDropdown} onSelect={(ev) => {
                      console.log("selected" + ev)
                    }}>
                      {
                        publisherList.map((publisher, index) => (
                          <Bootstrap.Dropdown.Item
                            key={`${publisher.name}-${publisher.id}-${index}`}
                            onMouseDown={() => {
                              setPublisherSearch(publisher.name)
                              setValues({ ...values, publisherid: publisher.id })
                            }}>
                            {publisher.name}
                          </Bootstrap.Dropdown.Item>
                        ))
                      }
                    </Bootstrap.DropdownMenu>
                  </Bootstrap.Form.Group>
                  <Bootstrap.Form.Group>
                    <Bootstrap.Form.Label>Published</Bootstrap.Form.Label>
                    <Bootstrap.Form.Control
                      disabled={mode === "delete"}
                      value={values.published}
                      onChange={handleChange}
                      name="published"
                      type="date"
                      placeholder="Published" />
                  </Bootstrap.Form.Group>

                  <Bootstrap.Form.Group>
                    <Bootstrap.Form.Label>In Store</Bootstrap.Form.Label>
                    <Bootstrap.Form.Control
                      disabled={mode === "delete"}
                      value={values.instore}
                      onChange={handleChange}
                      name="instore"
                      type="number"
                      placeholder="In Store" />
                  </Bootstrap.Form.Group>

                </Bootstrap.Form>
              </Bootstrap.Modal.Body>

              <Bootstrap.Modal.Footer>
                {
                  mode === "delete" ? (
                    <Bootstrap.Button variant="danger" onClick={() => {
                      handleSubmit()
                    }}>
                      Delete
                    </Bootstrap.Button>
                  ) : (
                    <Bootstrap.Button variant="primary" onClick={() => {
                      handleSubmit()
                    }}>
                      Submit
                    </Bootstrap.Button>
                  )
                }
              </Bootstrap.Modal.Footer>
            </Bootstrap.Modal>
          )
        }}
    </Formik>
  )
}

function BookManagerRow({ bookid, name, author, publisher, published, inStore }) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const { sessionToken, userData } = useAccount()

  return (
    <>
      <tr>
        <td>{name}</td>
        <td>{author}</td>
        <td>{publisher}</td>
        <td>{published}</td>
        <td>{inStore}</td>
        <td>
          <Bootstrap.ButtonGroup>
            <Bootstrap.Button
              onClick={() => setShowEditModal(true)}
              variant="success">
              <BootstrapIcons.Pencil />
            </Bootstrap.Button>
            <Bootstrap.Button
              variant="danger"
              onClick={() => setShowDeleteModal(true)}>
              <BootstrapIcons.Trash />
            </Bootstrap.Button>
          </Bootstrap.ButtonGroup>
        </td>
      </tr>

      <FormBookDetail
        mode="edit"
        isShown={showEditModal}
        onHide={() => setShowEditModal(false)}
        onSubmit={(values) => {
          let form = new FormData()
          form.append("title", values.title)
          form.append("authorid", values.authorid)
          form.append("publisherid", values.publisherid)
          form.append("published", values.published)
          form.append("instore", values.instore)

          axios({
            method: 'put',
            url: '/api/books',
            headers: {
              "Limana-SessionId": sessionToken,
              "Limana-UserEmail": userData?.email
            },
            data: form
          }).then((response) => {
            console.log(response)
            setShowEditModal(false)
            refreshBookList()
          }).catch((error) => {
            console.log(error)
          })
        }} />

      <FormBookDetail
        bookData={{
          title: name,
          published: published,
          instore: inStore
        }}
        mode="delete"
        isShown={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onSubmit={(values) => {
          axios({
            method: 'delete',
            url: `/api/books/${bookid}`,
            headers: {
              "Limana-SessionId": sessionToken,
              "Limana-UserEmail": userData?.email
            },
            data: form
          }).then((response) => {
            console.log(response)
            setShowDeleteModal(false)
            refreshBookList()
          }).catch((error) => {
            console.log(error)
          })
        }} />
    </>
  )
}

function FilterBookRow() {
  let query = useQuery()
  let navigate = useNavigate()

  const crrFrDate = query.get("pubfr") ? new Date(query.get("pubfr")) : new Date("1900-01-01")
  const crrToDate = query.get("pubto") ? new Date(query.get("pubto")) : new Date()

  let initialValues = {
    name: query.get("name") || "",
    author: query.get("author") || "",
    publisher: query.get("publisher") || "",
    pubfr: convertDateToDateString(crrFrDate),
    pubto: convertDateToDateString(crrToDate)
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        console.log(values)

        let params = new URLSearchParams()

        values.name && params.set("name", values.name)
        values.author && params.set("author", values.author)
        values.publisher && params.set("publisher", values.publisher)
        isValidDateString(values.pubfr) && params.set("pubfr", values.pubfr)
        isValidDateString(values.pubto) && params.set("pubto", values.pubto)

        console.log(params.toString())

        let uri = `/admin/books?${params.toString()}`

        navigate(uri)
      }}>
      {({ values, handleChange, handleSubmit, setValues }) => (
        <tr>
          <td>
            <Bootstrap.Form.Control
              value={values.name}
              onChange={handleChange}
              name="name"
              type="email"
              placeholder="Name" />
          </td>
          <td>
            <Bootstrap.Form.Control
              value={values.author}
              onChange={handleChange}
              name="author"
              type="text"
              placeholder="Author" />
          </td>
          <td>
            <Bootstrap.Form.Control
              value={values.publisher}
              onChange={handleChange}
              name="publisher"
              type="text"
              placeholder="Publisher" />
          </td>
          <td>
            <Bootstrap.InputGroup>
              <Bootstrap.Form.Control
                name="pubfr"
                value={values.pubfr}
                onChange={handleChange}
                type="date" placeholder="From" />
              <Bootstrap.Form.Control
                name="pubto"
                value={values.pubto}
                onChange={handleChange}
                type="date" placeholder="To" />
            </Bootstrap.InputGroup>
          </td>
          <td>
          </td>
          <td>
            <Bootstrap.ButtonGroup>
              <Bootstrap.Button variant="primary" onClick={() => handleSubmit()}>
                <BootstrapIcons.Search />
              </Bootstrap.Button>
              <Bootstrap.Button variant="danger" onClick={() => {
                setValues({
                  name: "",
                  author: "",
                  publisher: "",
                  pubfr: "",
                  pubto: ""
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

export default function BookManagerView() {
  const [bookList, setBookList] = useState([])
  const [showAddBookModal, setShowAddBookModal] = useState(false)
  const { sessionToken, userData } = useAccount()
  const query = useQuery()

  const refreshBookList = () => {
    let pubfr = query.get("pubfr")
    if (pubfr) {
      pubfr = new Date(pubfr).toISOString()
    } else {
      pubfr = null
    }

    let pubto = query.get("pubto")
    if (pubto) {
      pubto = new Date(pubto).toISOString()
    } else {
      pubto = null
    }

    axios({
      method: 'get',
      url: '/api/books/search',
      params: {
        name: query.get("name") || "",
        author: query.get("author") || "",
        publisher: query.get("publisher") || "",
        pubfr, pubto,
      }
    }).then((response) => {
      setBookList(response.data.books)
    }).catch((error) => {
      console.log(error)
    })
  }

  useEffect(() => {
    refreshBookList()
  }, [sessionToken, query])

  return (
    <>
      <ManagerView>
        <Container fluid className="h-100">
          <Bootstrap.Row>
            <Bootstrap.Col>
              <h1>Book Manager</h1>
            </Bootstrap.Col>
          </Bootstrap.Row>

          <Bootstrap.Row>
            <Bootstrap.Col className="m-2 d-flex justify-content-end">
              <Bootstrap.Button variant="primary" onClick={() => {
                setShowAddBookModal(true)
              }}>
                Add book
              </Bootstrap.Button>
            </Bootstrap.Col>
          </Bootstrap.Row>

          <Bootstrap.Row>
            <Bootstrap.Col>
              <Bootstrap.Table striped bordered hover>
                <thead>
                  <tr>
                    <td>Name</td>
                    <td>Author</td>
                    <td>Publisher</td>
                    <td>Published</td>
                    <td>In Store</td>
                    <td>Actions</td>
                  </tr>
                </thead>
                <tbody>
                  <FilterBookRow />
                  {
                    bookList.map((book, index) => {
                      return (
                        <BookManagerRow
                          key={`${book.id}-${index}`}
                          name={book.title}
                          author={book.authorname}
                          publisher={book.publisher}
                          published={book.publish_date}
                          inStore={book.number_instore}
                        />
                      )
                    })
                  }
                </tbody>
              </Bootstrap.Table>
            </Bootstrap.Col>
          </Bootstrap.Row>
        </Container>
      </ManagerView>

      <FormBookDetail
        mode="add"
        isShown={showAddBookModal}
        onHide={() => setShowAddBookModal(false)}
        onSubmit={(values) => {
          let form = new FormData()
          form.append("title", values.title)
          form.append("authorid", values.authorid)
          form.append("publisherid", values.publisherid)
          form.append("pubdate", values.published)
          form.append("instore", values.instore)

          axios({
            method: 'post',
            url: '/api/books',
            headers: {
              "Limana-SessionId": sessionToken,
              "Limana-UserEmail": userData?.email
            },
            data: form
          }).then((response) => {
            console.log(response)
            setShowAddBookModal(false)
            refreshBookList()
          }).catch((error) => {
            console.log(error)
          })
        }} />
    </>
  )
}
