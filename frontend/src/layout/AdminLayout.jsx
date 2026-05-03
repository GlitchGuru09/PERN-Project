import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/accounts', label: 'Accounts' },
    { path: '/admin/transactions', label: 'All Transactions' },
    { path: '/admin/upload-funds', label: 'Upload Funds' },
    { path: '/admin/ledger', label: 'Ledger' },
  ];

  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar */}
      <nav className="bg-dark text-white" style={{ width: '250px', minHeight: '100vh' }}>
        <div className="p-3">
          <h4 className="text-white mb-4">Admin Panel</h4>
          <ul className="nav flex-column">
            {menuItems.map((item) => (
              <li key={item.path} className="nav-item mb-2">
                <Link
                  className={`nav-link text-white ${
                    location.pathname === item.path ? 'bg-primary rounded' : ''
                  }`}
                  to={item.path}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Header */}
        <header className="bg-light border-bottom p-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Bank App</h5>
            <button className="btn btn-outline-danger btn-sm">
              Logout
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-grow-1 p-4 bg-light">
          <div className="toast-container position-fixed top-0 end-0 p-3" id="toastContainer"></div>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;