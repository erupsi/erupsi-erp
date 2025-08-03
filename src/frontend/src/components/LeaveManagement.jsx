import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3003';

function LeaveManagement() {
    const [leaveRequests, setLeaveRequests] = useState([]);

    // Fungsi untuk mengambil data pengajuan cuti dari API
    async function fetchLeaveRequests() {
        try {
            // Endpoint ini mengambil semua data tim (sesuai mock di backend)
            const response = await fetch(`${API_URL}/leave-requests/team`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setLeaveRequests(data);
        } catch (e) {
            console.error("Gagal mengambil data pengajuan cuti:", e);
        }
    }

    useEffect(() => {
        fetchLeaveRequests();
    }, []);

    const handleUpdateStatus = async (id, status) => {
        try {
            await fetch(`${API_URL}/leave-requests/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            // Muat ulang data untuk melihat perubahan status
            fetchLeaveRequests();
        } catch (e) {
             console.error("Gagal memperbarui status:", e);
        }
    };

    return (
        <div>
            <h2 className="page-header">Manajemen Cuti (Leave Requests)</h2>
            <h3>Daftar Pengajuan Cuti Tim</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID Karyawan</th>
                        <th>Tanggal Mulai</th>
                        <th>Tanggal Selesai</th>
                        <th>Alasan</th>
                        <th>Status</th>
                        <th>Aksi (Manajer)</th>
                    </tr>
                </thead>
                <tbody>
                    {leaveRequests.map((req) => (
                        <tr key={req.id}>
                            <td>{req.employee_id}</td>
                            <td>{req.start_date}</td>
                            <td>{req.end_date}</td>
                            <td>{req.reason}</td>
                            <td>{req.status}</td>
                            <td>
                                {req.status === 'pending' && (
                                    <>
                                        <button onClick={() => handleUpdateStatus(req.id, 'approved')} style={{ marginRight: '5px' }}>Setujui</button>
                                        <button onClick={() => handleUpdateStatus(req.id, 'rejected')} style={{ backgroundColor: '#e74c3c' }}>Tolak</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default LeaveManagement;