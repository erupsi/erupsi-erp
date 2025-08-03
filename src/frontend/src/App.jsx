import { useState } from 'react';
import './App.css';
import ShiftManagement from './components/ShiftManagement';

function App() {
    const [activeMenu, setActiveMenu] = useState('shifts');

    const renderContent = () => {
        switch (activeMenu) {
            case 'shifts':
                return <ShiftManagement />;
            case 'leave':
                return <div><h2>Halaman Manajemen Cuti (Segera Hadir)</h2></div>;
            case 'attendance':
                return <div><h2>Halaman Absensi (Segera Hadir)</h2></div>;
            case 'reports':
                return <div><h2>Halaman Laporan (Segera Hadir)</h2></div>;
            default:
                return <ShiftManagement />;
        }
    };

    return (
        <div className="container">
            <nav className="sidebar">
                <h2>WFM Service</h2>
                <ul>
                    <li className={activeMenu === 'shifts' ? 'active' : ''} onClick={() => setActiveMenu('shifts')}>
                        Manajemen Jadwal
                    </li>
                    <li className={activeMenu === 'leave' ? 'active' : ''} onClick={() => setActiveMenu('leave')}>
                        Manajemen Cuti
                    </li>
                    <li className={activeMenu === 'attendance' ? 'active' : ''} onClick={() => setActiveMenu('attendance')}>
                        Absensi
                    </li>
                    <li className={activeMenu === 'reports' ? 'active' : ''} onClick={() => setActiveMenu('reports')}>
                        Laporan
                    </li>
                </ul>
            </nav>
            <main className="main-content">
                {renderContent()}
            </main>
        </div>
    );
}

export default App;