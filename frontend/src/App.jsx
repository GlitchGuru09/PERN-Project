import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import Home from './pages/Home';
import AllTransactions from './pages/AllTransactions';
import RegisterAndLogin from './pages/admin/registraAndLogin/RegisterAndLogin';
import AdminLayout from './layout/AdminLayout';
import Dashboard from './pages/admin/dashboard/Dashboard';
import Accounts from './pages/admin/accounts/Accounts';


function App() {
  return (
    <Router>
        <Routes>
          <Route path="/admin/login" element={<RegisterAndLogin />} />
          <Route path="/admin/register" element={<RegisterAndLogin />} />
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/accounts" element={<Accounts />} />
            {/* <Route path="/admin/transactions" element={<div>All Transactions Page</div>} />
            <Route path="/admin/upload-funds" element={<div>Upload Funds Page</div>} />
            <Route path="/admin/ledger" element={<div>Ledger Page</div>} /> */}
          </Route>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/transactions" element={<AllTransactions />} />
          </Route>
          {/* Add Ledger route later */}
        </Routes>
    </Router>
  );
}

export default App;