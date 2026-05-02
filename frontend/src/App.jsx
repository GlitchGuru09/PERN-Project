import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import Home from './pages/Home';
import AllTransactions from './pages/AllTransactions';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/transactions" element={<AllTransactions />} />
          {/* Add Ledger route later */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;