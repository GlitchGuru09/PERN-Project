import React, { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import showToast from '../../utils/showToast'
import './style.css'

function Transfer() {
  const [accounts, setAccounts] = useState([]);
  const [selectedFromAccount, setSelectedFromAccount] = useState('');
  const [selectedToAccount, setSelectedToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const submitHandler = async e => {
    e.preventDefault();
    try {
      const body = { from_account: Number(selectedFromAccount), to_account: Number(selectedToAccount), amount, description }
      await axios.post('http://localhost:3000/transactions', body)
      window.location = '/'
    } catch (error) {
      const message = error?.response?.data?.error || 'Server error'
      showToast(message, 'danger')
    }
  }

  const getAccounts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/accounts');
      setAccounts(response.data);
    } catch (error) {
      const message = error?.response?.data?.error || 'Server error'
      showToast(message, 'danger')
    }
  }

  useEffect(() => {
    getAccounts();
  }, [])


  return (
    <Fragment >
      <h1 className='text-center mt-5'>Money Transfer</h1>
      <form className='transfer-form mt-5' onSubmit={submitHandler}>
        <div className="row">
          <div className="col">
            <div className="form-group">
              <label htmlFor="amount">From Account</label>
              <select required name="from_account" id="from_account" className='form-control' value={selectedFromAccount} onChange={e => setSelectedFromAccount(e.target.value)}>
                <option value="" disabled>Select from account</option>
                {accounts.map(account => (
                  <option key={account.ac_id} value={account.ac_id}>
                    {account.account_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label htmlFor="amount">To Account</label>
              <select required name="to_account" id="to_account" className='form-control' value={selectedToAccount} onChange={e => setSelectedToAccount(e.target.value)}>
                <option value="" disabled>Select to account</option>
                {accounts.map(account => (
                  <option key={account.ac_id} value={account.ac_id}>
                    {account.account_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input type="number" className='form-control' id="amount" placeholder='Enter Amount' value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        {/* <div className="form-group">
              <label htmlFor="amount">Currency</label>
              <select name="currency" id="currency" className='form-control' value={selectedToAccount} onChange={e => setSelectedToAccount(e.target.value)}>
                <option value="" disabled>Select currency</option>
                {accounts.map(account => (
                  <option key={account.ac_id} value={account.ac_id}>
                    {account.account_name}
                  </option>
                ))}
              </select>
            </div> */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input type="text" className='form-control' id="description" placeholder='Enter Description' value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <button className='btn btn-success'>Send</button>
      </form>
    </Fragment>
  )
}

export default Transfer
