# Financial Service

## A. Project Overview
Layanan ini bertanggung jawab untuk mengelola semua aspek keuangan internal perusahaan,
mulai dari manajemen buku besar umum, hutang piutang usaha, perhitungan pajak internal, dan laporan keuangan. 
Layanan ini menganut arsitektur mikroservis yang ketat, memastikan modularitas, skalabilitas,
dan penerapan independen.

## Teknologi Utama
- Backend : Node.js (v20+), Express.js
- Basis Data: PostgreSQL
- Frontend (Konseptual): Terintegrasi melalui API REST (kemungkinan aplikasi frontend terpisah, mis. React dengan Tailwind CSS)
- Otentikasi/Otorisasi: JSON Web Tokens (JWT) melalui Layanan Otentikasi (Auth Service)

Alat Pengembangan: ESLint, Docker, Jest, OpenAPI (Swagger) untuk dokumentasi API.

## B. Fungsionalitas Service
Layanan ini menyediakan fungsionalitas penting yang diperlukan akuntansi keuangan dalam ERP.
Fitur Utama : 

### **1. Manajemen Bagan Akun (Chart of Accounts - COA)**
- Membuat, Membaca, Memperbarui, Menghapus (CRUD) akun (aset, kewajiban, ekuitas, pendapatan, 
        beban)
- Mendukung struktur akun hierarkis 

### **2. Manajemen Jurnal Umum (General Journal)**
- Mencatat dan mengelola semua transaksi keuangan menggunakan sistem pembukuan berpasangan.
- Kemampuan untuk membuat, melihat, dan merinci entri jurnal
- Validasi untuk memastikan debit sama dengan kredit untuk setiap entri jurnal

### **3. Manajemen Buku Besar Umum (General Ledger - GL)**
- Memelihara catatan rinci semua transaksi keuangan per akun
- Kemampuan untuk melihat saldo akun dan riwayat transaksi untuk periode waktu tertentu

### **4. Pelaporan Keuangan (Financial Reporting)**
- Menghasilkan laporan keuangan dasar :
  *  
## C. Kebutuhan Interaksi dengan Service Lain
## D. Batasan Service