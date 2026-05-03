import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PersonPlus, ListCheck, BarChart, CloudArrowUp } from 'react-bootstrap-icons';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      id: 1,
      title: 'Add Account',
      description: 'Create a new account',
      icon: PersonPlus,
      path: '/admin/accounts',
    },
    {
      id: 2,
      title: 'All Transactions',
      description: 'View all transactions',
      icon: ListCheck,
      path: '/admin/transactions',
    },
    {
      id: 3,
      title: 'Ledger',
      description: 'View ledger details',
      icon: BarChart,
      path: '/admin/ledger',
    },
    {
      id: 4,
      title: 'Upload Funds',
      description: 'Upload funds to accounts',
      icon: CloudArrowUp,
      path: '/admin/upload-funds',
    },
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-cards-grid">
        {cards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.id}
              className="dashboard-card"
              onClick={() => handleCardClick(card.path)}
            >
              <div className="card-icon">
                <IconComponent size={48} />
              </div>
              <div className="card-content">
                <h3 className="card-title">{card.title}</h3>
                <p className="card-description">{card.description}</p>
              </div>
              <div className="card-arrow">→</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
