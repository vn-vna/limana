import * as Bootstrap from 'react-bootstrap'
import * as BootstrapIcons from 'react-bootstrap-icons'
import axios from "axios";

import MainNavbar from '$/comps/MainNavbar'
import LimanaFooter from '$/comps/LimanaFooter'
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useQuery } from "../comps/Query.jsx";
import { useAccount } from '../comps/AccountContext.jsx';

function SearchResultsRow({ bookid, name, author, publisher, published }) {
  const { sessionToken, userEmail } = useAccount()

  return (
    <tr>
      <td>{name}</td>
      <td>{author}</td>
      <td>{publisher}</td>
      <td>{published}</td>
      <td>
        <Bootstrap.ButtonGroup>
          <Bootstrap.Button
            onClick={() => {
              const formData = new FormData()
              formData.append('bookid', bookid)

              axios({
                method: 'post',
                url: '/api/borrowing',
                headers: {
                  "Limana-SessionID": sessionToken,
                  "Limana-UserEmail": userEmail
                },
                data: formData
              }).then((response) => {
                console.log(response.data)
              }).catch((error) => {
                console.log(error)
              })
            }}
            variant="success">
            <BootstrapIcons.ArrowRight />
          </Bootstrap.Button>
        </Bootstrap.ButtonGroup>
      </td>
    </tr>
  )
}

function SearchResults() {
  const params = useQuery()
  const navigate = useNavigate()
  const [query, setQuery] = useState(params.get("s") ?? "")
  const [booksData, setBooksData] = useState([])

  useEffect(() => {
    axios({
      method: 'get',
      url: '/api/books/search',
      params: {
        title: params.get("s"),
      }
    }).then((response) => {
      console.log(response.data)
      setBooksData(response.data.books)
    }).catch((error) => {
      console.log(error)
    })
  }, [params])

  return (
    <>
      <Bootstrap.Container className="h-50">
        <Bootstrap.Row>
          <Bootstrap.Col>
            <h1>Search Results {params.get("s") ? `for "${params.get("s")}"` : ""}</h1>
          </Bootstrap.Col>
        </Bootstrap.Row>

        <Bootstrap.Row>
          <Bootstrap.Col>
            <Bootstrap.InputGroup className="mb-3">
              <Bootstrap.FormControl
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={(e) => e.target.select()} />
              <Bootstrap.Button
                variant="primary"
                onClick={() => {
                  navigate(`/search?s=${query}`)
                }}>
                <BootstrapIcons.Search />
              </Bootstrap.Button>
            </Bootstrap.InputGroup>
          </Bootstrap.Col>
        </Bootstrap.Row>

        <Bootstrap.Row>
          <Bootstrap.Col>
            <Bootstrap.Table striped bordered hover>
              <thead>
                <tr>
                  <th>Book Name</th>
                  <th>Author</th>
                  <th>Publisher</th>
                  <th>Published</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  booksData.map((book) => {
                    return (
                      <SearchResultsRow
                        key={book.bookid}
                        bookid={book.bookid}
                        name={book.title}
                        author={book.authorname}
                        publisher={book.publisher}
                        published={book.publish_date} />
                    )
                  })
                }
              </tbody>
            </Bootstrap.Table>
          </Bootstrap.Col>
        </Bootstrap.Row>
      </Bootstrap.Container>
    </>
  )
}

export default function SearchView() {
  return (
    <>
      <Bootstrap.Container className='vh-100 d-flex flex-column justify-content-between' fluid>
        <Bootstrap.Row className='justify-content-center align-items-center'>
          <Bootstrap.Col className='text-center'>
            <MainNavbar />
          </Bootstrap.Col>
        </Bootstrap.Row>

        <SearchResults />

        <Bootstrap.Row className='justify-content-center align-items-center'>
          <Bootstrap.Col className='text-center'>
            <LimanaFooter />
          </Bootstrap.Col>
        </Bootstrap.Row>
      </Bootstrap.Container>
    </>
  )
}
