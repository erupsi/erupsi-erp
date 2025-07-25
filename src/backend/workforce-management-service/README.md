# Workforce Management Service (WFM)

**Update Terakhir**: 25 Juli 2025

Layanan ini bertanggung jawab untuk mengelola semua fungsi yang berkaitan dengan manajemen tenaga kerja, termasuk penjadwalan, absensi, dan pengajuan cuti. Layanan ini dirancang sebagai sebuah mikroservis backend yang terintegrasi penuh dengan layanan lain seperti *Auth Service* dan *User Service*.

---

## 📜 Daftar Isi

1.  [Status Saat Ini](#1-status-saat-ini)
2.  [Rencana Pengembangan (Roadmap)](#2-rencana-pengembangan-roadmap)
3.  [Endpoint API (V1)](#3-endpoint-api-v1)
4.  [Arsitektur & Teknologi](#4-arsitektur--teknologi)
5.  [Model Data (Struktur Database)](#5-model-data-struktur-database)
6.  [Interaksi Antar Layanan](#6-interaksi-antar-layanan)
7.  [Peran dan Hak Akses Pengguna (V1)](#7-peran-dan-hak-akses-pengguna-v1)
8.  [Cara Menjalankan Lokal](#8-cara-menjalankan-lokal)
9.  [Langkah Selanjutnya](#9-langkah-selanjutnya)

---

## 1. Status Saat Ini

**Fungsionalitas Inti V1 Selesai.**
Fondasi dasar layanan telah selesai diimplementasikan, termasuk:
-   Struktur direktori untuk model, rute, dan *middleware*.
-   Koneksi ke database PostgreSQL dengan Sequelize.
-   Implementasi **CRUD** (Create, Read, Update, Delete) penuh untuk *endpoint* `shifts`.
-   Implementasi fungsionalitas dasar untuk `leave_requests` dan `attendances`.
-   Kerangka kerja untuk otentikasi dan otorisasi.

---

## 2. Rencana Pengembangan (Roadmap)

-   **✅ V1: Fondasi Inti**
    -   Integrasi dengan *Auth Service* & *User Service*.
    -   Manajemen jadwal kerja (*shifts*) dan absensi dasar.
    -   Otorisasi berbasis peran (Manajer, Karyawan, Admin).

-   **⏳ V2: Peningkatan Nilai Tambah**
    -   Perencanaan kapasitas.
    -   Dasbor visibilitas untuk manajer.
    -   Wawasan pribadi untuk karyawan.

-   **📅 V3: Fitur Jangka Panjang**
    -   Pelacakan produktivitas, wawasan lokasi, dan analitik prediktif.

---

## 3. Endpoint API (V1)

#### **Shifts**
-   `POST /shifts` - Membuat jadwal kerja baru.
-   `GET /shifts` - Mengambil data jadwal.
-   `PUT /shifts/:id` - Memperbarui shift yang sudah ada.
-   `DELETE /shifts/:id` - Menghapus sebuah shift.

#### **Leave Requests**
-   `POST /leave-requests` - Mengajukan permintaan cuti/izin.
-   `GET /leave-requests/team` - Melihat daftar permintaan dari tim.
-   `PUT /leave-requests/:id/status` - Menyetujui atau menolak permintaan.

#### **Attendances**
-   `POST /attendances/check-in` - Mencatat waktu masuk kerja.
-   `PUT /attendances/check-out/:id` - Mencatat waktu keluar kerja.
-   `GET /attendances/history` - Melihat riwayat absensi pribadi.

---

## 4. Arsitektur & Teknologi

-   **Arsitektur**: Mikroservis yang berkomunikasi via API REST.
-   **Backend**: Node.js & Express.js.
-   **Database**: PostgreSQL dengan Sequelize ORM.
-   **Tools**: Docker & OpenAPI/Swagger.

---

## 5. Model Data (Struktur Database)

| Tabel | Deskripsi |
| :--- | :--- |
| `employees` | Pusat informasi personalia, posisi, dan struktur tim. |
| `shifts` | Alokasi jadwal kerja spesifik (tanggal & jam) per karyawan. |
| `attendances`| Catatan `check-in` & `check-out` aktual. |
| `leave_requests` | Alur pengajuan dan persetujuan cuti/izin. |

---

## 6. Interaksi Antar Layanan

| Layanan | Tujuan | Contoh Interaksi |
| :--- | :--- | :--- |
| **Mengonsumsi dari:** | | |
| Auth Service | Memverifikasi identitas dan hak akses pengguna. | WFM mengirim token ke `POST /auth/validate`. |
| User Service | Mendapatkan data master karyawan yang akurat. | WFM memanggil `GET /api/users` untuk mengambil daftar staf. |
| **Menyediakan untuk:** | | |
| Aplikasi Frontend | Memberdayakan seluruh fungsi pada UI. | Frontend memanggil `GET /api/wfm/shifts` atau `POST /api/wfm/leave-requests`. |
| Finansial/Payroll| Menyediakan data jam kerja untuk perhitungan gaji. | Payroll memanggil `GET /api/wfm/payroll-summary`. |

---

## 7. Peran dan Hak Akses Pengguna (V1)

- **Manajer / Supervisor 🧑‍💼**: CRUD pada jadwal timnya, Approve/Reject permintaan cuti.
- **Karyawan (Employee) 👤**: Baca jadwal pribadi, Buat permintaan cuti, Lakukan `check-in/out`.
- **Admin / HR ⚙️**: Akses global *read-only*, manajemen konfigurasi, dan intervensi manual.

---

## 8. Cara Menjalankan Lokal

1.  Pastikan layanan PostgreSQL berjalan.
2.  Pastikan file `.env` di direktori root sudah terisi dengan benar.
3.  Jalankan perintah berikut di terminal dari direktori root proyek:
    ```bash
    npm start --workspace=workforce-management-service
    ```
4.  Layanan akan berjalan di `http://localhost:3003`.

> **⚠️ DISCLAIMER UNTUK PENGUJIAN LOKAL**
>
> Konfigurasi saat ini **hanya untuk pengujian lokal** dan **tidak terhubung** ke layanan lain seperti *Auth Service*.
>
> - **Otentikasi Dinonaktifkan**: *Middleware* `authenticateToken` dan `authorizeManager` di semua file rute telah dinonaktifkan sementara (dijadikan komentar atau *commented out*).
> - **Data Pengguna Statis**: Kode ini menggunakan ID pengguna statis (*hardcoded*) untuk membuat data baru.
>
> **Untuk menyambungkan ke API lain:** Anda harus **mengaktifkan kembali** *middleware* tersebut dan menghapus ID statis dari kode *controller*.

---

## 9. Langkah Selanjutnya

-   Membuat model `Employee` dan mendefinisikan relasi antar tabel.
-   Mengimplementasikan logika bisnis yang lebih kompleks (contoh: validasi `check-in` terhadap jadwal).
-   Menulis unit test menggunakan Jest untuk setiap fitur yang telah dibuat.