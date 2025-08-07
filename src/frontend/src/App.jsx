import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import './App.scss';
import Sidenav from './components/sidenav';
import TopBar from './components/topBar';
import Template from './pages/template';
import Example from './pages/example';
import Home from './pages/home';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPage = location.pathname.split('/')[1] || 'home';
  const [grandchildItems, setGrandchildItems] = useState([]);

  const setCurrentPage = (page) => {
    navigate(`/${page}`);
  };

  // 👇 Reset grandchild breadcrumbs if not on a section that supports it
  // useEffect(() => {
  //   const isEcommerce = location.pathname.startsWith('/ecommerce/');
  //   const isInvoices = location.pathname.startsWith('/invoices/');
  //   const isTemplate = location.pathname.startsWith('/template/');
  //   if (!isEcommerce && !isTemplate && !isInvoices) {
  //     setGrandchildItems([]);
  //   }
  // }, [location]);

  return (
    <div className="main-body">
      <Sidenav setCurrentPage={setCurrentPage} currentPage={currentPage} />
      <div className="main-container">
        <TopBar setCurrentPage={setCurrentPage} currentPage={currentPage} grandchildItems={grandchildItems} />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home setGrandchildItems={setGrandchildItems} />} />
          <Route path="/ecommerce" element={<Navigate to="/ecommerce/emarket" />} />
          <Route path="/ecommerce/*" element={<Example setGrandchildItems={setGrandchildItems} />} />
          {/* <Route path="/template" element={<Template />} />
          <Route path="/assets" element={<Template />} />
          <Route path="/preferences" element={<Template />} /> */}
          <Route path="*" element={<Template setGrandchildItems={setGrandchildItems} />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
