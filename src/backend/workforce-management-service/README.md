# Workforce Management Service (WFM)

**Update Terakhir**: 27 Juli 2025

Layanan ini bertanggung jawab untuk mengelola semua fungsi yang berkaitan dengan manajemen tenaga kerja, termasuk penjadwalan, absensi, dan pengajuan cuti. Layanan ini dirancang sebagai sebuah **mikroservis backend** yang terintegrasi penuh dengan layanan lain seperti *Auth Service* dan *User Service*.

---

## 📜 Daftar Isi

1.  [Status Saat Ini](#1-status-saat-ini)
2.  [Rencana Pengembangan (Roadmap)](#2-rencana-pengembangan-roadmap)
3.  [Endpoint API (V1)](#3-endpoint-api-v1)
4.  [Arsitektur & Teknologi](#4-arsitektur--teknologi)
5.  [Model Data (Struktur Database)](#5-model-data-struktur-database)
6.  [Peran dan Hak Akses Pengguna (V1)](#6-peran-dan-hak-akses-pengguna-v1)
7.  [Cara Menjalankan Lokal](#7-cara-menjalankan-lokal)
8.  [Pengujian](#8-pengujian)
9.  [Langkah Selanjutnya](#9-langkah-selanjutnya)

---

## 1. Status Saat Ini

**Fungsionalitas Inti V1 Selesai.**
Fondasi dan logika bisnis dasar untuk layanan WFM telah selesai diimplementasikan, termasuk:
-   Struktur direktori untuk model, rute, dan *middleware*.
-   Koneksi ke database PostgreSQL dengan Sequelize.
-   Implementasi **CRUD** (Create, Read, Update, Delete) untuk fitur `Shifts`.
-   Implementasi fungsionalitas dasar untuk `Leave Requests` dan `Attendances`.
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

## 3. Struktur Komponen dan Endpoint API (V1)

### Endpoint API (V1)

#### **Shifts** (`/shifts`)
-   `POST /`: Membuat jadwal kerja baru.
-   `GET /`: Mengambil semua data jadwal.
-   `PUT /:id`: Memperbarui shift yang sudah ada.
-   `DELETE /:id`: Menghapus sebuah shift.

#### **Leave Requests** (`/leave-requests`)
-   `POST /`: Mengajukan permintaan cuti/izin.
-   `GET /team`: Melihat daftar permintaan dari tim.
-   `PUT /:id/status`: Menyetujui atau menolak permintaan.

#### **Attendances** (`/attendances`)
-   `POST /check-in`: Mencatat waktu masuk kerja.
-   `PUT /check-out/:id`: Mencatat waktu keluar kerja.
-   `GET /history`: Melihat riwayat absensi pribadi.

#### **Reports** (`/reports`)
-   `GET /work-hours-summary`: Mengambil rekapitulasi jam kerja berdasarkan rentang tanggal.

### Struktur Komponen

Layanan ini dibangun dengan struktur yang terorganisir untuk memisahkan tanggung jawab:

-   `src/index.js`: Titik masuk utama aplikasi. Bertugas menginisialisasi server Express, mendaftarkan semua rute, dan menyinkronkan model database.
-   `/config`: Berisi konfigurasi aplikasi, seperti koneksi database (`database.js`).
-   `/models`: Mendefinisikan skema tabel database menggunakan Sequelize. File `index.js` di dalam direktori ini bertugas sebagai pusat untuk mengumpulkan semua model.
-   `/routes`: Mendefinisikan *endpoint* API dan menghubungkannya dengan logika *controller*. Setiap file mewakili satu sumber daya (misalnya, `shifts.js`).
-   `/middleware`: Berisi fungsi-fungsi perantara yang dijalankan sebelum *controller*, seperti `auth.js` untuk otentikasi dan otorisasi.
-   `/services`: Berisi logika untuk berkomunikasi dengan layanan eksternal (misalnya, `userService.js` yang akan berinteraksi dengan User Service).
-   `/__tests__`: Berisi semua file pengujian unit dan integrasi untuk setiap fitur.

---

## 4. Arsitektur & Teknologi

-   **Arsitektur**: Mikroservis yang berkomunikasi via API REST.
-   **Backend**: Node.js & Express.js.
-   **Database**: PostgreSQL dengan Sequelize ORM.
-   **Tools**: Docker & OpenAPI/Swagger.

#### Dependensi Utama
-   `express`: Kerangka kerja web untuk membangun API.
-   `sequelize`: ORM untuk berinteraksi dengan database PostgreSQL.
-   `pg`: Driver database PostgreSQL untuk Node.js.
-   `dotenv`: Memuat variabel lingkungan dari file `.env` untuk pengembangan lokal.
-   `jest` & `supertest`: Kerangka kerja untuk pengujian unit dan API.

---

## 5. Model Data (Struktur Database)

// Catatan: Tabel 'Employees' ini hanya untuk visualisasi.
// Data aslinya berasal dari User Service (External).
Table Employees as E {
  id uuid [pk, note: 'Primary Key dari User Service']
  full_name varchar
  manager_id uuid
}

Table Shifts {
  id uuid [pk]
  employee_id uuid [ref: > E.id]
  shift_date date
  start_time time
  end_time time
  status varchar [note: "'active' atau 'on_leave'"]
  created_at timestamp
  updated_at timestamp
}

Table LeaveRequests {
  id uuid [pk]
  employee_id uuid [ref: > E.id]
  start_date date
  end_date date
  reason text
  status varchar [note: "'pending', 'approved', 'rejected'"]
  created_at timestamp
  updated_at timestamp
}

Table Attendances {
  id uuid [pk]
  employee_id uuid [ref: > E.id]
  check_in timestamp
  check_out timestamp
  status varchar [note: "'on_time', 'late'"]
  duration_hours decimal(5, 2)
}

Table IncidentReports {
  id uuid [pk]
  employee_id uuid [ref: > E.id, note: 'Karyawan yang terlibat']
  incident_date timestamp
  description text
  reported_by uuid [ref: > E.id, note: 'Manajer yang melaporkan']
  created_at timestamp
  updated_at timestamp
}
---

## 6. Peran dan Hak Akses Pengguna (V1)

- **Manajer / Supervisor 🧑‍💼**: CRUD pada jadwal timnya, Approve/Reject permintaan cuti.
- **Karyawan (Employee) 👤**: Baca jadwal pribadi, Buat permintaan cuti, Lakukan `check-in/out`.
- **Admin / HR ⚙️**: Akses global *read-only*, manajemen konfigurasi, dan intervensi manual.

### Alur Kerja & Logika Bisnis Penting

Berikut adalah beberapa implementasi logika bisnis kunci yang sudah ada di dalam layanan:

-   **Sinkronisasi Status Cuti ke Jadwal**:
    -   Ketika sebuah `leave_request` diperbarui dengan status `approved` melalui `PUT /leave-requests/:id/status`, layanan akan secara otomatis mencari semua `shifts` milik karyawan tersebut yang berada dalam rentang tanggal cuti.
    -   Status dari `shifts` yang ditemukan akan diubah menjadi `on_leave`.

-   **Penentuan Status Absensi Otomatis**:
    -   Saat seorang karyawan melakukan `check-in` melalui `POST /attendances/check-in`, layanan akan mencari jadwal (`shift`) karyawan tersebut untuk hari itu.
    -   Jika `check_in` dilakukan melewati `start_time` dari jadwal (dengan toleransi 5 menit), status absensi akan otomatis ditandai sebagai `late`. Jika tidak, statusnya adalah `on_time`.

-   **Validasi Manajer (Simulasi)**:
    -   Saat seorang manajer mencoba menyetujui/menolak cuti, *endpoint* `PUT /leave-requests/:id/status` akan memanggil *mock service* (`userService.js`) untuk memeriksa apakah karyawan yang mengajukan cuti adalah bagian dari tim manajer tersebut.
    -   Jika tidak, permintaan akan ditolak dengan status `403 Forbidden`.

-   **Kalkulasi Jam Kerja**:
    -   Ketika seorang karyawan melakukan `check-out`, total durasi jam kerja akan dihitung dan disimpan di dalam data absensi.
    -   *Endpoint* `GET /reports/work-hours-summary` menggunakan data ini untuk menyediakan rekapitulasi jam kerja.

---

## 7. Cara Menjalankan Lokal

1.  Pastikan layanan PostgreSQL berjalan.
2.  Pastikan file `.env` di direktori root sudah terisi dengan benar.
3.  Jalankan perintah berikut dari direktori root proyek:
    ```bash
    npm start --workspace=workforce-management-service
    ``` 
4.  Layanan akan berjalan di `http://localhost:3003`.

> **⚠️ DISCLAIMER UNTUK PENGUJIAN LOKAL**
>
> Konfigurasi saat ini **hanya untuk pengujian lokal** dan **tidak terhubung** ke layanan lain seperti *Auth Service*.
>
> - **Otentikasi Dinonaktifkan**: *Middleware* `authenticateToken` dan `authorizeManager` di semua file rute telah dinonaktifkan sementara.
> - **Data Pengguna Statis**: Kode ini menggunakan ID pengguna statis (*hardcoded*) untuk membuat data baru.
>
> **Untuk menyambungkan ke API lain:** Anda harus **mengaktifkan kembali** *middleware* tersebut dan mengganti ID statis dari kode *controller*.

---

## 8. Pengujian

Proyek ini menggunakan Jest. Setiap layanan memiliki direktori `__test__` untuk file-file tesnya.

-   **Menjalankan Semua Tes**:
    Dari direktori root, jalankan:
    ```bash
    npm test --workspace=workforce-management-service
    ```

---

## 9. Langkah Selanjutnya

-   **Integrasi Penuh**: Mengganti *mock service* dan ID statis dengan panggilan API nyata ke `Auth Service` dan `User Service`.
-   **Penyempurnaan Logika Bisnis**: Mengimplementasikan logika yang lebih kompleks seperti validasi manajer saat menyetujui cuti.
-   **Melengkapi Unit Test**: Menambah cakupan tes untuk memastikan semua skenario tertangani.