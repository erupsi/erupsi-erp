import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3003';

function Reports() {
    const [summary, setSummary] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fungsi untuk mengambil data laporan dari API
    const fetchSummary = async (event) => {
        event.preventDefault();
        setLoading(true);

        const { start_date, end_date } = event.target.elements;

        try {
            const response = await fetch(`${API_URL}/reports/payroll-summary?start_date=${start_date.value}&end_date=${end_date.value}`);
            const data = await response.json();
            setSummary(data);
        } catch (e) {
            console.error("Failed to fetch reports:", e);
            setSummary([]); // Kosongkan data jika error
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="page-header">Laporan Rekapitulasi Jam Kerja</h2>

            <div className="form-card">
                <h3>Filter Laporan</h3>
                <form onSubmit={fetchSummary}>
                    <div className="form-group">
                        <label>Tanggal Mulai</label>
                        <input name="start_date" type="date" required />
                    </div>
                    <div className="form-group">
                        <label>Tanggal Selesai</label>
                        <input name="end_date" type="date" required />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Memuat...' : 'Tampilkan Laporan'}
                    </button>
                </form>
            </div>

            <h3>Hasil Laporan</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID Karyawan</th>
                        <th>Nama Lengkap</th>
                        <th>Total Jam Kerja</th>
                    </tr>
                </thead>
                <tbody>
                    {summary.map((item) => (
                        <tr key={item.employee_id}>
                            <td>{item.employee_id}</td>
                            <td>{item.full_name}</td>
                            <td>{item.total_hours}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Reports;