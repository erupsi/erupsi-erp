import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3003';

function ShiftManagement() {
    const [shifts, setShifts] = useState([]);
    const [editingShift, setEditingShift] = useState(null);

    async function fetchShifts() {
        try {
            const response = await fetch(`${API_URL}/shifts`);
            const data = await response.json();
            setShifts(data);
        } catch (e) {
            console.error("Gagal mengambil data shifts:", e);
        }
    }

    useEffect(() => {
        fetchShifts();
    }, []);

    const handleAddShift = async (event) => {
        event.preventDefault();
        const form = event.target;
        const newShift = {
            employee_id: form.employee_id.value,
            shift_date: form.shift_date.value,
            start_time: form.start_time.value,
            end_time: form.end_time.value,
        };

        await fetch(`${API_URL}/shifts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newShift),
        });

        fetchShifts();
        form.reset();
    };

    const handleUpdateShift = async (event) => {
        event.preventDefault();
        const form = event.target;
        const updatedShift = {
            employee_id: form.employee_id.value,
            shift_date: form.shift_date.value,
            start_time: form.start_time.value,
            end_time: form.end_time.value,
        };

        await fetch(`${API_URL}/shifts/${editingShift.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedShift),
        });

        fetchShifts();
        setEditingShift(null); 
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
            await fetch(`${API_URL}/shifts/${id}`, {
                method: 'DELETE',
            });
            fetchShifts();
        }
    };

    const startEdit = (shift) => {
        setEditingShift(shift);
    };

    return (
        <div>
            <h2 className="page-header">Manajemen Jadwal (Shifts)</h2>

            <div className="form-card">
                <h3>{editingShift ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}</h3>
                <form onSubmit={editingShift ? handleUpdateShift : handleAddShift}>
                    <div className="form-group">
                        <label>ID Karyawan</label>
                        <input name="employee_id" type="text" required defaultValue={editingShift?.employee_id || ''} placeholder="Masukkan UUID karyawan" />
                    </div>
                    <div className="form-group">
                        <label>Tanggal</label>
                        <input name="shift_date" type="date" required defaultValue={editingShift?.shift_date || ''} />
                    </div>
                    <div className="form-group">
                        <label>Jam Mulai</label>
                        <input name="start_time" type="time" required defaultValue={editingShift?.start_time || ''} />
                    </div>
                    <div className="form-group">
                        <label>Jam Selesai</label>
                        <input name="end_time" type="time" required defaultValue={editingShift?.end_time || ''} />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit">{editingShift ? 'Simpan Perubahan' : 'Simpan Jadwal'}</button>
                        {editingShift && (
                            <button type="button" onClick={() => setEditingShift(null)} style={{ backgroundColor: '#7f8c8d' }}>
                                Batal
                            </button>
                        )}
                    </div>
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
                        <th>Aksi</th>
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
                            <td>
                                <button onClick={() => startEdit(shift)} style={{ marginRight: '5px' }}>
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(shift.id)} style={{ backgroundColor: '#e74c3c' }}>
                                    Hapus
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ShiftManagement;