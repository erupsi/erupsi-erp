import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3003';

function LeaveManagement() {
    const [leaveRequests, setLeaveRequests] = useState([]);

    async function fetchLeaveRequests() {
        try {
            const response = await fetch(`${API_URL}/leave-requests/team`);
            const data = await response.json();
            setLeaveRequests(data);
        } catch (e) {
            console.error("Gagal mengambil data pengajuan cuti:", e);
        }
    }

    useEffect(() => {
        fetchLeaveRequests();
    }, []);

    const handleAddRequest = async (event) => {
        event.preventDefault();
        // --- POP-UP KONFIRMASI ---
        if (!window.confirm('Apakah Anda yakin ingin mengajukan cuti ini?')) {
            return;
        }
        const form = event.target;
        const newRequest = {
            start_date: form.start_date.value,
            end_date: form.end_date.value,
            reason: form.reason.value,
        };

        await fetch(`${API_URL}/leave-requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRequest),
        });

        fetchLeaveRequests();
        form.reset();
    };

    const handleUpdateStatus = async (id, status) => {
        const action = status === 'approved' ? 'menyetujui' : 'menolak';
        // --- POP-UP KONFIRMASI ---
        if (!window.confirm(`Apakah Anda yakin ingin ${action} pengajuan cuti ini?`)) {
            return;
        }
        await fetch(`${API_URL}/leave-requests/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        fetchLeaveRequests();
    };

    return (
        <div>
            <h2 className="page-header">Manajemen Cuti (Leave Requests)</h2>

            <div className="form-card">
                <h3>Ajukan Cuti Baru</h3>
                <form onSubmit={handleAddRequest}>
                    <div className="form-group">
                        <label>Tanggal Mulai</label>
                        <input name="start_date" type="date" required />
                    </div>
                    <div className="form-group">
                        <label>Tanggal Selesai</label>
                        <input name="end_date" type="date" required />
                    </div>
                    <div className="form-group">
                        <label>Alasan</label>
                        <input name="reason" type="text" required placeholder="Contoh: Acara keluarga" />
                    </div>
                    <button type="submit">Kirim Pengajuan</button>
                </form>
            </div>

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