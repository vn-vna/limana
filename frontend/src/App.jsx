import * as Bootstrap from "react-bootstrap"
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom'

import "$/App.scss"
import Home from "$/views/Home"
import NotFoundView from "$/views/NotFound"
import AccountView from "$/views/Account"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<AccountView />} />
          <Route path="*" element={<NotFoundView />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
