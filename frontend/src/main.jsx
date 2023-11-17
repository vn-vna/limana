import React from 'react'
import ReactDOM from 'react-dom/client'

import App from '$/App.jsx'
import AccountProvider from '$/comps/AccountContext'

import '$/index.scss'
import 'bootstrap/dist/css/bootstrap.min.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AccountProvider>
      <App />
    </AccountProvider>
  </React.StrictMode>,
)
