import * as Bootstrap from "react-bootstrap"
import { HashRouter, Route, Routes } from 'react-router-dom'

import "$/App.scss"
import Home from "$/views/Home"

function App() {
  return (
    <>
      <HashRouter >
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </HashRouter>
    </>
  )
}

export default App
