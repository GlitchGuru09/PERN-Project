import React, { Fragment } from 'react'
import './App.css'
//components
import Transfer from './components/transfer/index.jsx'
import ListTransfer from './components/list_transfer/index.jsx'

function App() {
  return (
      <Fragment>
        <div className="container">
          <Transfer/>
          <ListTransfer/>
        </div>
      </Fragment>
  )
}

export default App