import React, { useState } from 'react';

import './App.scss';
import Sidenav from './components/sidenav';

import Template from './pages/template';
import Dashboard from './pages/dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('template');

  // variabel currentPage dapat diubah pada src/frontend/src/components/sidenav/MenuItems.jsx fun handleSubmenuClick. sesuaikan casenya
  const renderPage = () => {
    switch (currentPage) {
      case 'template':
        return <Template />; // Halaman Template | import Template from './pages/template';
      case 'home':
        return <Dashboard />;
      default:
        return <Template />;
    }
  };

  return (
    <div className="main-body">
      <Sidenav setCurrentPage={setCurrentPage} />
      <div className="main-container">
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
