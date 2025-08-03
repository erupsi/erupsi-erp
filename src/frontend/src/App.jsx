import { useState } from 'react';
import './App.css';
import ShiftManagement from './components/ShiftManagement';
import LeaveManagement from './components/LeaveManagement';
import Attendance from './components/Attendance';
import Reports from './components/Reports';
import IncidentReports from './components/IncidentReports';

function App() {
    const [activeMenu, setActiveMenu] = useState('shifts');

    const renderContent = () => {
        switch (activeMenu) {
            case 'shifts':
                return <ShiftManagement />;
            case 'leave':
                return <LeaveManagement />;
            case 'attendance':
                return <Attendance />;
            case 'reports':
                return <Reports />;
            case 'incidents':
                return <IncidentReports />;
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
                    <li className={activeMenu === 'incidents' ? 'active' : ''} onClick={() => setActiveMenu('incidents')}>
                        Laporan Insiden
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