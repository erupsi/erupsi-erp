# Workforce Management Service (WFM)

**Update Terakhir**: 24 Juli 2025

[cite_start]Layanan ini bertanggung jawab untuk mengelola semua fungsi yang berkaitan dengan manajemen tenaga kerja, termasuk penjadwalan, absensi, dan pengajuan cuti, sesuai dengan dokumen **SKPL WFM**. [cite: 26, 28, 218, 219, 220] [cite_start]Layanan ini dirancang sebagai sebuah mikroservis backend yang terintegrasi penuh dengan layanan lain seperti *Auth Service* dan *User Service*. [cite: 30]

---

## 📜 Daftar Isi

1.  [Status Saat Ini](#1-status-saat-ini)
2.  [Rencana Pengembangan (Roadmap)](#2-rencana-pengembangan-roadmap)
3.  [Endpoint API (V1)](#3-endpoint-api-v1)
4.  [Arsitektur & Teknologi](#4-arsitektur--teknologi)
5.  [Cara Menjalankan Lokal](#5-cara-menjalankan-lokal)
6.  [Langkah Selanjutnya](#6-langkah-selanjutnya)

---

## 1. Status Saat Ini

Ini adalah penyiapan awal **(Initial Setup)** untuk layanan WFM (V1). Fondasi dasar telah dibuat, termasuk:
-   Struktur direktori untuk model, rute, dan *middleware*.
-   Konfigurasi sebagai *workspace* di dalam monorepo.
-   Kerangka dasar server Express.js.
-   [cite_start]*Endpoint* API placeholder untuk fitur-fitur inti V1. [cite: 52, 53, 54, 55, 56]
-   [cite_start]*Middleware* placeholder untuk otentikasi dan otorisasi. [cite: 67]

---

## 2. Rencana Pengembangan (Roadmap)

[cite_start]Pengembangan layanan ini dibagi menjadi tiga tahap utama: [cite: 32]

-   **✅ V1: Fondasi Inti**
    -   [cite_start]Integrasi dengan *Auth Service* & *User Service*. [cite: 239]
    -   [cite_start]Manajemen jadwal kerja (*shifts*) dan absensi dasar. [cite: 241]
    -   [cite_start]Otorisasi berbasis peran (Manajer, Karyawan, Admin). [cite: 242]

-   **⏳ V2: Peningkatan Nilai Tambah**
    -   [cite_start]Perencanaan kapasitas. [cite: 246]
    -   [cite_start]Dasbor visibilitas untuk manajer. [cite: 248]
    -   [cite_start]Wawasan pribadi untuk karyawan. [cite: 249]

-   **📅 V3: Fitur Jangka Panjang**
    -   [cite_start]Pelacakan produktivitas, wawasan lokasi, dan analitik prediktif. [cite: 39, 254, 256, 259]

---

## 3. Endpoint API (V1)

Berikut adalah *endpoint* yang telah didefinisikan kerangkanya untuk versi pertama:

#### **Shifts**
-   [cite_start]`POST /shifts` - Membuat jadwal kerja baru. [cite: 52]
-   [cite_start]`GET /shifts` - Mengambil data jadwal berdasarkan filter. [cite: 53, 54]
-   [cite_start]`PUT /shifts/:id` - Memperbarui shift yang sudah ada. [cite: 55]
-   [cite_start]`DELETE /shifts/:id` - Menghapus sebuah shift. [cite: 56]

#### **Leave Requests**
-   [cite_start]`POST /leave-requests` - Mengajukan permintaan cuti/izin. [cite: 176]
-   `GET /leave-requests/team` - Melihat daftar permintaan dari tim (untuk manajer).
-   `PUT /leave-requests/:id/status` - Menyetujui atau menolak permintaan.

#### **Attendances**
-   [cite_start]`POST /attendances/check-in` - Mencatat waktu masuk kerja. [cite: 202]
-   [cite_start]`PUT /attendances/check-out/:id` - Mencatat waktu keluar kerja. [cite: 202]
-   [cite_start]`GET /attendances/history` - Melihat riwayat absensi pribadi. [cite: 249]

---

## 4. Arsitektur & Teknologi

-   [cite_start]**Arsitektur**: Mikroservis yang berkomunikasi via API REST. [cite: 142, 143]
-   [cite_start]**Backend**: Node.js. [cite: 97]
-   [cite_start]**Database**: PostgreSQL. [cite: 97]
-   [cite_start]**Tools**: Docker & OpenAPI/Swagger. [cite: 97, 98]

---

## 5. Cara Menjalankan Lokal

1.  Pastikan Anda berada di direktori **root** proyek.
2.  Jalankan perintah berikut di terminal:
    ```bash
    npm start --workspace=workforce-management-service
    ```
3.  Layanan akan berjalan di `http://localhost:3003`.

---

## 6. Langkah Selanjutnya

-   Koneksi ke database PostgreSQL dan implementasi model data.
-   Mengisi logika bisnis di dalam fungsi-fungsi *controller* sesuai spesifikasi.
-   Menulis unit test menggunakan Jest untuk setiap fitur.