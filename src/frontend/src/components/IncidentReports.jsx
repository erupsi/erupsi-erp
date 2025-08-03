import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3003';

function IncidentReports() {
    const [incidents, setIncidents] = useState([]);

    async function fetchIncidents() {
        try {
            const response = await fetch(`${API_URL}/incidents`);
            const data = await response.json();
            setIncidents(data);
        } catch (e) {
            console.error("Gagal mengambil data insiden:", e);
        }
    }

    useEffect(() => {
        fetchIncidents();
    }, []);

    const handleAddIncident = async (event) => {
        event.preventDefault();
        const form = event.target;
        const newIncident = {
            employee_id: form.employee_id.value,
            incident_date: form.incident_date.value,
            description: form.description.value,
        };

        await fetch(`${API_URL}/incidents`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newIncident),
        });

        fetchIncidents();
        form.reset();
    };
    
    // Fungsi Delete
    const handleDelete = async (id) => {
        if(window.confirm('Apakah Anda yakin ingin menghapus laporan insiden ini?')) {
             await fetch(`${API_URL}/incidents/${id}`, {
                method: 'DELETE',
            });
            fetchIncidents();
        }
    };


    return (
        <div>
            <h2 className="page-header">Laporan Insiden Kerja</h2>

            <div className="form-card">
                <h3>Buat Laporan Insiden Baru</h3>
                <form onSubmit={handleAddIncident}>
                    <div className="form-group">
                        <label>ID Karyawan Terlibat</label>
                        <input name="employee_id" type="text" required placeholder="Masukkan UUID karyawan" />
                    </div>
                    <div className="form-group">
                        <label>Tanggal & Waktu Insiden</label>
                        <input name="incident_date" type="datetime-local" required />
                    </div>
                    <div className="form-group">
                        <label>Deskripsi Insiden</label>
                        <input name="description" type="text" required />
                    </div>
                    <button type="submit">Kirim Laporan</button>
                </form>
            </div>

            <h3>Daftar Laporan Insiden</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID Karyawan</th>
                        <th>Tanggal Insiden</th>
                        <th>Deskripsi</th>
                        <th>Dilaporkan Oleh</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {incidents.map((incident) => (
                        <tr key={incident.id}>
                            <td>{incident.employee_id}</td>
                            <td>{new Date(incident.incident_date).toLocaleString('id-ID')}</td>
                            <td>{incident.description}</td>
                            <td>{incident.reported_by}</td>
                            <td>
                                <button onClick={() => handleDelete(incident.id)} style={{ backgroundColor: '#e74c3c' }}>Hapus</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default IncidentReports;