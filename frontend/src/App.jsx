import * as Bootstrap from "react-bootstrap"
import {BrowserRouter, HashRouter, Route, Routes} from 'react-router-dom'

import "$/App.scss"
import Home from "$/views/Home"
import NotFoundView from "$/views/NotFound"
import AccountView from "$/views/Account"
import CollectionView from "$/views/Collection"
import SearchView from "$/views/Search"
import AccountManagerView from "$/views/AccountManager.jsx";
import BookManagerView from "./views/BookManager.jsx";
import AuthorManagerView from "./views/AuthorManager.jsx";
import PublisherManagerView from "./views/PublisherManager.jsx";
import BorrowManager from "./views/BorrowManager.jsx"

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/account" element={<AccountView/>}/>
          <Route path="/collection" element={<CollectionView/>}/>
          <Route path="/admin">
            <Route path={"users"} element={<AccountManagerView />}></Route>
            <Route path={"books"} element={<BookManagerView />}></Route>
            <Route path={"authors"} element={<AuthorManagerView />}></Route>
            <Route path={"publishers"} element={<PublisherManagerView />}></Route>
            <Route path={"borrow"} element={<BorrowManager />}></Route>
          </Route>
          <Route path="/search" element={<SearchView/>}/>
          <Route path="*" element={<NotFoundView/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}
