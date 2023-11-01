import * as Bootstrap from "react-bootstrap"
import { HashRouter, Route, Routes } from 'react-router-dom'

import "$/App.scss"
import Home from "$/views/Home"
import MainNavbar from "$/views/MainNavbar"
import ExampleView from "./views/Example"

function App() {
  return (
    <>
      <HashRouter >
        <MainNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ex/*" element={<ExampleView />} />
        </Routes>
      </HashRouter>
    </>
  )
}

export default App
