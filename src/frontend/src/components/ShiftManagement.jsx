import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3003';

function ShiftManagement() {
    const [shifts, setShifts] = useState([]);

    // Fungsi untuk mengambil data shifts dari API
    async function fetchShifts() {
        try {
            const response = await fetch(`${API_URL}/shifts`);
            const data = await response.json();
            setShifts(data);
        } catch (e) {
            console.error("Failed to fetch shifts:", e);
        }
    }

    useEffect(() => {
        fetchShifts();
    }, []);

    const handleAddShift = async (event) => {
        event.preventDefault();
        const { employee_id, shift_date, start_time, end_time } = event.target.elements;

        const newShift = {
            employee_id: employee_id.value,
            shift_date: shift_date.value,
            start_time: start_time.value,
            end_time: end_time.value,
        };

        await fetch(`${API_URL}/shifts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newShift),
        });

        fetchShifts(); // Ambil ulang data untuk memperbarui tabel
        event.target.reset(); // Kosongkan form
    };

    return (
        <div>
            <h2 className="page-header">Manajemen Jadwal (Shifts)</h2>

            <div className="form-card">
                <h3>Tambah Jadwal Baru</h3>
                <form onSubmit={handleAddShift}>
                    <div className="form-group">
                        <label>ID Karyawan</label>
                        <input name="employee_id" type="text" required placeholder="Contoh: c1a2b3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d" />
                    </div>
                    <div className="form-group">
                        <label>Tanggal</label>
                        <input name="shift_date" type="date" required />
                    </div>
                    <div className="form-group">
                        <label>Jam Mulai</label>
                        <input name="start_time" type="time" required />
                    </div>
                    <div className="form-group">
                        <label>Jam Selesai</label>
                        <input name="end_time" type="time" required />
                    </div>
                    <button type="submit">Simpan Jadwal</button>
                </form>
            </div>

            <h3>Daftar Jadwal</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID Karyawan</th>
                        <th>Tanggal</th>
                        <th>Mulai</th>
                        <th>Selesai</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {shifts.map((shift) => (
                        <tr key={shift.id}>
                            <td>{shift.employee_id}</td>
                            <td>{shift.shift_date}</td>
                            <td>{shift.start_time}</td>
                            <td>{shift.end_time}</td>
                            <td>{shift.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ShiftManagement;