import axios from "axios";
import ManagerView from "./Manager";
import * as Bootstrap from "react-bootstrap";
import * as BootstrapIcons from "react-bootstrap-icons";
import { useEffect, useMemo, useState } from "react";
import { useAccount } from "../comps/AccountContext";

function BorrowManagerRow({ borrowid, book, user, startDate, endDate, status, refreshBorrows }) {
  const { sessionToken, userEmail } = useAccount()
  return (
    <>
      <tr>
        <td>{book}</td>
        <td>{user}</td>
        <td>{startDate}</td>
        <td>{endDate}</td>
        <td>
          {status === "PENDING" ? (
            <>
              <Bootstrap.ButtonGroup>
                <Bootstrap.Button variant="success" onClick={() => {
                  axios({
                    method: "put",
                    url: `/api/borrowing/${borrowid}/accept`,
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
                }}>
                  <BootstrapIcons.Check />
                </Bootstrap.Button>

                <Bootstrap.Button variant="danger">
                  <BootstrapIcons.X />
                </Bootstrap.Button>

              </Bootstrap.ButtonGroup>
            </>
          ) : status}

        </td>
      </tr>
    </>
  )
}

export default function BorrowManager() {
  const [borrows, setBorrows] = useState([])
  const { sessionToken, userEmail } = useAccount()
  const refreshBorrows = () => {
    if (!sessionToken || !userEmail) {
      setBorrows([])
      return
    }

    axios({
      method: "get",
      url: "/api/borrowing",
      headers: {
        "Limana-SessionId": sessionToken,
        "Limana-UserEmail": userEmail
      }
    }).then(res => {
      setBorrows(res.data.borrowings)
    }).catch(err => {
      console.log(err)
    })
  }

  useEffect(() => {
    refreshBorrows()
  }, [sessionToken, userEmail])

  return (
    <>
      <ManagerView>
        <Bootstrap.Container fluid className="h-100">
          <Bootstrap.Row>
            <Bootstrap.Col>
              <h1>Borrow Manager</h1>
            </Bootstrap.Col>
          </Bootstrap.Row>

          <Bootstrap.Row>
            <Bootstrap.Col className="m-2 d-flex justify-content-center">
              <Bootstrap.Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>User</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    borrows.map(borrow => {
                      return (
                        <BorrowManagerRow
                          key={borrow.id}
                          borrowid={borrow.id}
                          book={borrow.book_title}
                          user={borrow.user_email}
                          startDate={borrow.borrow_date}
                          endDate={borrow.return_date}
                          status={borrow.status}
                          refreshBorrows={refreshBorrows}
                        />
                      )
                    })
                  }
                </tbody>
              </Bootstrap.Table>
            </Bootstrap.Col>
          </Bootstrap.Row>
        </Bootstrap.Container>
      </ManagerView>
    </>
  )
}