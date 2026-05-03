import React, { useState, useEffect } from 'react';
import {Box,Button, Dialog, DialogTitle, DialogContent,DialogActions,TextField,MenuItem,Typography,Paper,IconButton,Chip,} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import showToast from '../../../utils/showToast';
import './Accounts.css';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountType, setAccountType] = useState('savings');
  const [balance, setBalance] = useState('');

  // Fetch accounts on component mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/accounts');
      setAccounts(response.data);
    } catch (error) {
      showToast('Failed to fetch accounts', 'danger');
    }
  };

  const handleOpenModal = (account = null) => {
    if (account) {
      setEditingAccount(account);
      setAccountName(account.accountName);
      setAccountNumber(account.accountNumber);
      setBankName(account.bankName);
      setAccountType(account.accountType);
      setBalance(account.balance.toString());
    } else {
      setEditingAccount(null);
      setAccountName('');
      setAccountNumber('');
      setBankName('');
      setAccountType('savings');
      setBalance('');
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingAccount(null);
    setAccountName('');
    setAccountNumber('');
    setBankName('');
    setAccountType('savings');
    setBalance('');
  };

  const validateForm = () => {
    if (!accountName || !accountNumber || !bankName || !balance) {
      showToast('All fields are required', 'warning');
      return false;
    }

    if (isNaN(balance) || parseFloat(balance) < 0) {
      showToast('Please enter a valid balance', 'warning');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const data = {
        accountName,
        accountNumber,
        bankName,
        accountType,
        balance,
      };

      if (editingAccount) {
        await axios.put(`http://localhost:3000/accounts/${editingAccount.id}`, data);
        showToast('Account updated successfully!', 'success');
      } else {
        await axios.post('http://localhost:3000/accounts', data);
        showToast('Account created successfully!', 'success');
      }

      fetchAccounts();
      handleCloseModal();
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to save account';
      showToast(errorMessage, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this account?')) return;

    try {
      await axios.delete(`http://localhost:3000/accounts/${id}`);
      showToast('Account deleted successfully!', 'success');
      fetchAccounts();
    } catch (error) {
      showToast('Failed to delete account', 'danger');
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'accountName', headerName: 'Account Name', width: 200 },
    { field: 'accountNumber', headerName: 'Account Number', width: 180 },
    { field: 'bankName', headerName: 'Bank Name', width: 150 },
    {
      field: 'accountType',
      headerName: 'Type',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'savings' ? 'primary' : params.value === 'checking' ? 'secondary' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'balance',
      headerName: 'Balance',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold">
          ${parseFloat(params.value).toFixed(2)}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            size="small"
            onClick={() => handleOpenModal(params.row)}
          >
            <Edit />
          </IconButton>
          <IconButton
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3, maxWidth: '1400px', mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Accounts Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenModal()}
          sx={{ borderRadius: 2 }}
        >
          Add Account
        </Button>
      </Box>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={accounts}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          checkboxSelection
          disableSelectionOnClick
          loading={!accounts.length && loading}
        />
      </Paper>

      {/* Add/Edit Account Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            {editingAccount ? 'Edit Account' : 'Add New Account'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Account Name"
              name="accountName"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Account Number"
              name="accountNumber"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Bank Name"
              name="bankName"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              select
              fullWidth
              label="Account Type"
              name="accountType"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              margin="normal"
              required
            >
              <MenuItem value="savings">Savings</MenuItem>
              <MenuItem value="checking">Checking</MenuItem>
              <MenuItem value="money-market">Money Market</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Initial Balance"
              name="balance"
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              margin="normal"
              required
              inputProps={{ step: '0.01' }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleCloseModal} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            sx={{ borderRadius: 2 }}
          >
            {loading ? 'Saving...' : editingAccount ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Accounts;