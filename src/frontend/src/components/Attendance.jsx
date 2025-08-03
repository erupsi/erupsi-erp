import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3003';

const formatDateTime = (isoString) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
};

function Attendance() {
    const [message, setMessage] = useState('');
    const [lastCheckInId, setLastCheckInId] = useState(null);
    const [history, setHistory] = useState([]);

    // Fungsi untuk mengambil riwayat
    const fetchHistory = async () => {
        try {
            const response = await fetch(`${API_URL}/attendances/history`);
            const data = await response.json();
            setHistory(data);
        } catch (e) {
            console.error('Gagal mengambil riwayat:', e);
        }
    };

    // Ambil riwayat saat komponen pertama kali dimuat
    useEffect(() => {
        fetchHistory();
    }, []);

    const handleCheckIn = async () => {
        try {
            const response = await fetch(`${API_URL}/attendances/check-in`, { method: 'POST' });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                setLastCheckInId(data.data.id);
                fetchHistory();
            } else {
                setMessage(`Error: ${data.error}`);
            }
        } catch (e) {
            setMessage('Gagal terhubung ke server.');
        }
    };

    const handleCheckOut = async () => {
        const attendanceIdToCheckOut = lastCheckInId || history.find(h => h.check_out === null)?.id;

        if (!attendanceIdToCheckOut) {
            setMessage('Tidak ada sesi check-in yang aktif untuk di-checkout.');
            return;
        }
        try {
            const response = await fetch(`${API_URL}/attendances/check-out/${attendanceIdToCheckOut}`, { method: 'PUT' });
            const data = await response.json();
             if (response.ok) {
                setMessage(data.message);
                setLastCheckInId(null);
                fetchHistory();
            } else {
                setMessage(`Error: ${data.error}`);
            }
        } catch (e) {
            setMessage('Gagal terhubung ke server.');
        }
    };

    return (
        <div>
            <h2 className="page-header">Absensi Karyawan</h2>

            <div className="form-card">
                <h3>Catat Kehadiran</h3>
                <p>Simulasikan absensi untuk karyawan (ID di-hardcode di backend).</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={handleCheckIn}>Check-In</button>
                    <button onClick={handleCheckOut}>Check-Out</button>
                </div>
                {message && <p style={{ marginTop: '15px', fontWeight: 'bold' }}>{message}</p>}
            </div>

            <h3>Riwayat Absensi Terakhir</h3>
            <table>
                <thead>
                    <tr>
                        <th>Check In</th>
                        <th>Check Out</th>
                        <th>Status</th>
                        <th>Total Jam</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((item) => (
                        <tr key={item.id}>
                            <td>{formatDateTime(item.check_in)}</td>
                            <td>{formatDateTime(item.check_out)}</td>
                            <td>{item.status}</td>
                            <td>{item.duration_hours || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Attendance;