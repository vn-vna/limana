import * as Bootstrap from 'react-bootstrap'

import MainNavbar from '$/comps/MainNavbar'
import LimanaFooter from '$/comps/LimanaFooter'
import { useEffect, useState } from 'react'
import { useAccount } from '../comps/AccountContext'
import axios from 'axios'

function CollectionCard({ borrowid, title, startDate, endDate, status, refreshBorrows }) {
  const { sessionToken, userEmail } = useAccount()

  return (
    <Bootstrap.Col className='mb-2 text-center' sm={4}>
      <Bootstrap.Card>
        <Bootstrap.Card.Header>
          <Bootstrap.Card.Title>{title}</Bootstrap.Card.Title>
        </Bootstrap.Card.Header>
        <Bootstrap.Card.Body>
          <Bootstrap.Card.Text>
            {startDate} - {endDate}
          </Bootstrap.Card.Text>
          <Bootstrap.Card.Text>
            {status}
          </Bootstrap.Card.Text>
        </Bootstrap.Card.Body>
        <Bootstrap.Card.Footer>
          <Bootstrap.Button disabled={status != "ACCEPTED"} variant="danger" onClick={() => {
            axios({
              method: "put",
              url: `/api/borrowing/${borrowid}/return`,
              headers: {
                "Limana-SessionId": sessionToken,
                "Limana-UserEmail": userEmail
              }
            }).then(res => {
              console.log(res)

              refreshBorrows()
            }).catch(err => {
              console.log(err)
            })
          }
          }>
            Return
          </Bootstrap.Button>
        </Bootstrap.Card.Footer>
      </Bootstrap.Card>
    </Bootstrap.Col>
  )
}

export default function CollectionView() {

  const { sessionToken, userEmail } = useAccount()
  const [collection, setCollection] = useState([])

  const refreshCollection = () => {
    if (!sessionToken || !userEmail) return

    axios({
      method: "get",
      url: "/api/borrowing/user",
      headers: {
        "Limana-SessionId": sessionToken,
        "Limana-UserEmail": userEmail
      }
    }).then(res => {
      setCollection(res.data.borrowings)
    }).catch(err => {
      console.log(err)
    })
  }

  useEffect(() => {
    refreshCollection()
  }, [sessionToken, userEmail])

  return (
    <>
      <Bootstrap.Container className='vh-100 d-flex flex-column justify-content-between' fluid>
        <Bootstrap.Row className='justify-content-center align-items-center'>
          <Bootstrap.Col className='text-center'>
            <MainNavbar />
          </Bootstrap.Col>
        </Bootstrap.Row>

        <Bootstrap.Row className='justify-content-center align-items-center flex-grow-1'>
          <Bootstrap.Col className='text-center h-100'>
            <Bootstrap.Container fluid className='h-100'>
              <Bootstrap.Row className='justify-content-center align-items-center'>
                <Bootstrap.Col className='text-center'>
                  <h1>Collection</h1>
                </Bootstrap.Col>
              </Bootstrap.Row>

              <Bootstrap.Row>
                {
                  collection.map((item, index) => (
                    <CollectionCard
                      refreshBorrows={refreshCollection}
                      borrowid={item.id}
                      title={item.book_title}
                      author={item.book_author}
                      startDate={item.borrow_date}
                      endDate={item.return_date}
                      status={item.status}
                      key={item.id} />
                  ))
                }
              </Bootstrap.Row>

            </Bootstrap.Container>
          </Bootstrap.Col>
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