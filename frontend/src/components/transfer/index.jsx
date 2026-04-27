import React, { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import './style.css'

function Transfer() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [transaction_type, setTransactionType] = useState('');
  const [status, setStatus] = useState('');
  const [description, setDescription] = useState('');

   const submitHandler = async e => {
    e.preventDefault();
    try {
      const body = { account: Number(selectedAccount), amount, transaction_type, status, description }
      const response = await axios.post('http://localhost:3000/transaction', body)
      if(response.status === 400) {
        alert(response.data.error)
        return;
      }
      else if(response.status === 500) {
        alert('Server error')
        return;
      }
      window.location = '/'
    } catch (error) {
      console.log(error.message)
    }
  }

  const getAccounts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/accounts');
        setAccounts(response.data);
      } catch (error) {
        console.log(error.message)
      }
    }

  useEffect(() => {
    getAccounts();
  }, [])


  return (
    <Fragment >
      <h1 className='text-center mt-5'>Money Transfer</h1>
      <form className='transfer-form mt-5' onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="amount">Account</label>
          <select name="account" id="account" className='form-control' value={selectedAccount} onChange={e => setSelectedAccount(e.target.value)}>
            <option value="">Select Account</option>
            {accounts.map(account => (
              <option key={account.ac_id} value={account.ac_id}>
                {account.account_name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input type="number" className='form-control' id="amount" placeholder='Enter Amount' value={amount} onChange={e => setAmount(e.target.value)}/>
        </div>
        <div className="form-group">
          <label htmlFor="transaction_type">Transaction Type</label>
          <input type="text" className='form-control' id="transaction_type" placeholder='Enter Transaction Type' value={transaction_type} onChange={e => setTransactionType(e.target.value)}/>
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <input type="text" className='form-control' id="status" placeholder='Enter Status' value={status} onChange={e => setStatus(e.target.value)}/>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input type="text" className='form-control' id="description" placeholder='Enter Description' value={description} onChange={e => setDescription(e.target.value)}/>
        </div>
        <button className='btn btn-success'>Send</button>
      </form>
    </Fragment>
  )
}

export default Transfer
