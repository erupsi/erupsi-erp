# Spesifikasi Kebutuhan Perangkat Lunak (SKPL) Mini - Layanan Finansial

## 1. Pendahuluan
### 1.1 Tujuan
Dokumen ini menjelaskan kebutuhan untuk Layanan Finansial sebagai mikroservis yang mengelola seluruh operasi keuangan internal perusahaan, termasuk buku besar umum, hutang/piutang usaha, perhitungan pajak, dan pelaporan keuangan.

### 1.2 Ruang Lingkup
Layanan Finansial adalah mikroservis backend dalam ekosistem ERP, bertanggung jawab atas data dan proses keuangan inti. Layanan ini menyediakan API REST untuk integrasi dengan aplikasi frontend dan layanan backend lainnya.

## 2. Deskripsi Umum
### 2.1 Konteks Sistem
- Bagian dari sistem ERP berbasis mikroservis
- Berkomunikasi dengan layanan lain (Auth, Procurement, Order Management, HRM) melalui API REST
- Menyediakan data keuangan ke aplikasi frontend melalui API REST

### 2.2 Modul
- Bagan Akun (Chart of Accounts/COA)
- Jurnal Umum
- Buku Besar Umum
- Pelaporan Keuangan
- Hutang Usaha
- Piutang Usaha
- Agregasi Penggajian (dari HRM)
- Perhitungan & Pelaporan Pajak

### 2.3 Titik Integrasi
- Layanan Auth: Validasi JWT untuk otentikasi/otorisasi
- Layanan Pengadaan: Mengambil faktur vendor untuk hutang dan pajak
- Manajemen Pesanan: Mengambil faktur pelanggan untuk piutang dan pajak
- Layanan HRM: Mengambil ringkasan penggajian untuk jurnal dan pajak
- Frontend: Mengekspos API REST untuk data dan pelaporan keuangan

## 3. Kebutuhan Fungsional
### 3.1 Bagan Akun
- Operasi CRUD untuk akun (aset, kewajiban, ekuitas, pendapatan, beban)
- Mendukung struktur akun hierarkis

### 3.2 Jurnal Umum
- Mencatat dan mengelola transaksi pembukuan berpasangan
- Memvalidasi bahwa debit sama dengan kredit

### 3.3 Buku Besar Umum
- Memelihara catatan transaksi rinci per akun
- Melihat saldo dan riwayat akun per periode

### 3.4 Pelaporan Keuangan
- Menghasilkan neraca, laporan laba rugi, neraca saldo

### 3.5 Hutang Usaha
- Memproses dan melacak faktur vendor
- Mengelola kewajiban yang belum dibayar
- Mencatat pembayaran keluar

### 3.6 Piutang Usaha
- Memproses dan melacak faktur pelanggan
- Mengelola piutang yang belum tertagih
- Mencatat penerimaan kas masuk

### 3.7 Agregasi Penggajian
- Mencatat ringkasan penggajian dari HRM (bukan penggajian individu)

### 3.8 Perhitungan & Pelaporan Pajak
- Mengelola tarif pajak
- Mengotomatiskan perhitungan pajak pada transaksi
- Mencatat kewajiban pajak
- Menghasilkan laporan pajak internal

## 4. Kebutuhan Non-Fungsional
- **Kinerja:** Harus menangani hingga 10.000 transaksi/hari dengan waktu respons API <500ms
- **Skalabilitas:** Mendukung penskalaan horizontal melalui Docker dan API stateless
- **Keamanan:** Otentikasi berbasis JWT, otorisasi berbasis peran, endpoint API yang aman
- **Keandalan:** Waktu aktif 99,9%, cadangan otomatis
- **Pemeliharaan:** Basis kode modular, dokumentasi API melalui OpenAPI/Swagger
- **Auditabilitas:** Semua transaksi keuangan harus dicatat dan dapat dilacak

## 5. Antarmuka Sistem
- **API REST:** Untuk komunikasi frontend dan antar layanan
- **Basis Data:** PostgreSQL untuk penyimpanan permanen
- **Layanan Eksternal:** Auth, Procurement, Order Management, HRM melalui REST

## 6. Kendala & Ruang Lingkup yang Tidak Termasuk
- Hanya operasi keuangan inti yang termasuk dalam ruang lingkup
- Manajemen aset lanjutan, akuntansi biaya, penganggaran, manajemen treasury tidak termasuk dalam ruang lingkup

# Layanan Finansial

## A. Gambaran Proyek
Layanan ini bertanggung jawab untuk mengelola semua aspek keuangan internal perusahaan,
mulai dari manajemen buku besar umum, hutang piutang usaha, perhitungan pajak internal, dan laporan keuangan. 
Layanan ini menganut arsitektur mikroservis yang ketat, memastikan modularitas, skalabilitas,
dan penerapan independen.

## Teknologi Utama
- Backend : Node.js (v20+ - Express.js)
- Basis Data: PostgreSQL
- Frontend (Konseptual): Terintegrasi melalui API REST (kemungkinan aplikasi frontend terpisah, mis. React dengan 
Tailwind CSS)
- Otentikasi/Otorisasi: JSON Web Tokens (JWT) melalui Layanan Otentikasi (Auth Service)
- Alat Pengembangan: ESLint, Docker, Jest, OpenAPI (Swagger) untuk dokumentasi API

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

### **3. Manajemen Buku Besar Umum (General Ledger)**
- Memelihara catatan rinci semua transaksi keuangan per akun
- Kemampuan untuk melihat saldo akun dan riwayat transaksi untuk periode waktu tertentu

### **4. Pelaporan Keuangan (Financial Reporting)**
  Menghasilkan laporan keuangan dasar :
- Neraca (Balance sheet) : Gambaran aset, kewajiban, dan ekuitas pada titik waktu tertentu
- Laporan keuntungan kerugian (Profit & Loss) : Ringkasan pendapatan, beban, serta laba/rugi bersih selama periode
  waktu tertentu
- Neraca Saldo (Trial Balance): Daftar semua akun buku besar dengan saldo debit dan kreditnya, memastikan keseimbangan
  
### **5. Manajemen Hutang Usaha (Accounts Payable)**
- Memproses dan melacak faktur vendor
- Mengelola kewajiban yang belum dibayar kepada pemasok
- Mencatat dan melacak pembayaran keluar

### **6. Manajemen Piutang Usaha (Acounts Receivable)**
- Memproses dan melacak faktur pelanggan
- Mengelola piutang yang belum tertagih dari pelanggan
- Mencatat dan melacak penerimaan kas masuk

### **7. Pencatatan Gaji (Integrasi Agregat)**
- Kemampuan untuk mencatat ringkasan data penggajian (total beban gaji, total hutang PPh 21, total hutang BPJS, dll.) 
yang diterima dari Layanan Manajemen Sumber Daya Manusia (HRM Service) ke dalam buku besar umum. 
**Layanan ini tidak melakukan perhitungan gaji individual atau mengelola rincian potongan karyawan.**

### **8. Perhitungan dan Pencatatan Pajak Perusahaan**
- Konfigurasi Tarif Pajak: Mengelola tarif pajak yang menjadi kewajiban perusahaan (misalnya PPN, PPh Pasal tertentu)
- Perhitungan Pajak Transaksional: Mengotomatiskan perhitungan PPN Masukan/Keluaran pada faktur pembelian/penjualan yang
diintegrasikan
- Pencatatan Hutang Pajak: Secara otomatis mencatat hutang pajak yang timbul dari transaksi dan ringkasan penggajian ke 
buku besar
- Laporan Pajak Internal: Menghasilkan laporan ringkasan pajak (misalnya, total PPN Masukan/Keluaran, 
total PPh yang dipotong oleh perusahaan) untuk tujuan internal atau sebagai dasar konsolidasi data pajak perusahaan


## C. Kebutuhan Interaksi dengan Service Lain
Sebagai mikroservis, Layanan Finansial berkomunikasi dengan layanan lain dalam ekosistem ERP terutama melalui panggilan API REST,
memastikan kontrak API yang jelas untuk setiap interaksi.

### 1. Mengonsumsi Data dari Layanan Lain
Layanan Finansial menarik data yang diperlukan dari layanan lain melalui API REST yang mereka ekspos. 
Setiap layanan akan memiliki kontrak API-nya sendiri, yang dipatuhi oleh Layanan Finansial.

| Layanan (Service)  | Tujuan                                                                                                                                                                         |       Interaksi     |
| ------------------ |--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------| ------------------- |
| Autentikasi (Auth) | Otentikasi dan Otorisasi pengguna.                                                                                                                                             | Layanan Finansial memvalidasi JWT yang masuk yang dikeluarkan oleh Layanan Otentikasi untuk memastikan permintaan yang sah dan menentukan peran/izin pengguna.|
| Pengadaan (Procurement) | Mengambil detail Pesanan Pembelian (PO) dan Faktur Vendor, termasuk informasi harga dan pajak yang relevan untuk pencatatan hutang usaha dan PPN Masukan.                      | Layanan Finansial akan membuat panggilan API (mis. GET /api/procurement/invoices?status=ready_for_finance) untuk mengambil faktur vendor yang perlu diproses. |
| Manajemen Pesanan (Order Management) | Mengambil detail Pesanan Penjualan dan Faktur Pelanggan, termasuk informasi harga dan pajak yang relevan untuk pencatatan piutang usaha dan PPN Keluaran.                      | Layanan Finansial akan membuat panggilan API (mis. GET /api/orders/invoices?status=ready_for_finance) untuk mengambil faktur pelanggan yang perlu diproses. |
| Manajemen SDM (Human Resources Management - HRM) | Mengambil ringkasan data penggajian yang mencakup total beban gaji, total PPh 21 yang dipotong dari karyawan, dan total iuran BPJS yang menjadi kewajiban perusahaan/karyawan. | Layanan Finansial akan membuat panggilan API (mis. GET /api/hrm/payroll/summary?period=2024-06) untuk mengambil angka agregat ini untuk pencatatan jurnal dan perhitungan hutang pajak perusahaan. |

### 2. Menyediakan Data ke Layanan Lain 
Layanan Finansial menyediakan data keuangan ke layanan lain melalui API REST yang diekspos, terutama memungkinkan mereka untuk GET informasi.

| Layanan (Service) | Tujuan                                                                                                   |        Interaksi       |
| ----------------- |----------------------------------------------------------------------------------------------------------| ---------------------- |
| Pengadaan (Procurement) | Menyediakan status pembayaran faktur vendor.                                                             |  Layanan Pengadaan dapat membuat panggilan API (mis. GET /api/finance/ap-status/{invoiceId}) untuk menanyakan status pembayaran faktur vendor tertentu yang dikelola oleh Layanan Finansial. |
| Manajement Pesanan (Order Management) | Menyediakan status pembayaran faktur pelanggan.                                                          | Layanan Manajemen Pesanan dapat membuat panggilan API (mis. GET /api/finance/ar-status/{invoiceId}) untuk menanyakan status pembayaran faktur pelanggan tertentu. |

    
## D. Batasan Service
Layanan Finansial mematuhi batasan yang jelas untuk mempertahankan fokusnya dan mencegah perluasan ruang lingkup yang tidak semestinya, sesuai dengan prinsip mikroservis.

***Dalam Cakupan (Dicakup/Direncanakan dalam waktu dekat)***
- Manajemen Bagan Akun
- Manajemen Jurnal Umum & Buku Besar Umum
- Laporan Keuangan Inti (Neraca, Laporan Laba Rugi, Neraca Saldo)
- Manajemen Hutang Usaha (Pemrosesan Faktur Vendor, Pembayaran Keluar)
- Manajemen Piutang Usaha (Pemrosesan Faktur Pelanggan, Penerimaan Kas Masuk)
- Pencatatan Data Gaji Dasar (integrasi dengan Layanan HRM)
- Rekonsiliasi Kas dan Bank Dasar (mungkin manual)
- Manajemen Pajak Internal (Perhitungan PPN Transaksional, PPh 21 dari Gaji, Pencatatan Hutang Pajak, Laporan Pajak Ringkas Internal)

***Diluar Cakupan (Akan ditangani oleh Layanan Terpisah atau Fase Mendatang)***
- Manajemen Aset yang Kompleks: Pelacakan rinci, jadwal depresiasi, dan manajemen siklus hidup aset tetap.
- Akuntansi Biaya (Cost Accounting): Analisis biaya lanjutan, analisis varian, dan perhitungan biaya pekerjaan.
- Penganggaran & Peramalan (Budgeting & Forecasting): Alat untuk membuat, mengelola, dan melacak anggaran dan perkiraan keuangan.
- Manajemen Keuangan (Treasury Management): Manajemen kas yang canggih, investasi, dan lindung nilai valuta asing (FX).
- Pengarsipan Pajak/Pelaporan Kepatuhan Eksternal: Pembuatan laporan pajak resmi yang spesifik dalam format yang disyaratkan untuk pengajuan langsung ke badan pemerintah (mis. e-SPT, e-Faktur dalam format XML/CSV yang siap diunggah). Layanan ini akan menyediakan data dasar, tetapi generasi file pelaporan akhir di luar lingkup.

## E. Peran Akses ke Fitur Layanan Finansial
Akses ke fungsionalitas Layanan Finansial dikontrol secara ketat berdasarkan peran pengguna yang telah ditentukan, divalidasi melalui token JWT yang dikeluarkan oleh Layanan Otentikasi. Setiap permintaan masuk menyertakan payload JWT yang berisi informasi pengguna dan peran yang ditugaskan kepada mereka, 
yang kemudian digunakan oleh Layanan Finansial untuk pemeriksaan otorisasi yang terperinci.

Peran berikut menentukan tingkat akses :\
1. ADMIN ERP :
   - Akses CRUD Penuh : Bagan akun, Entri Jurnal, Konfigurasi Tarif Pajak.
   - Akses Baca Penuh : Semua Laporan Keuangan, Hutang Usaha, Piutang Usaha, Buku Besar Umum, Laporan Pajak Internal.
   - Manajemen Penuh : Pemrosesan pembayaran, konfigurasi keuangan dan pajak perusahaan lainnya.

2. FINANCE MANAGER :
    - Akses Baca : Bagan Akun, Entri Jurnal, Buku Besar Umum, Konfigurasi Tarif Pajak.
    - Akses Persetujuan/Update : Entri Jurnal yang memerlukan persetujuan, Hutang Usaha (persetujuan pembayaran), Piutang Usaha (persetujuan penerimaan kas), Validasi & Persetujuan Laporan Pajak Internal.
    - Akses Baca Penuh : Semua Laporan Keuangan, Laporan Pajak Internal.
   
3. ACCOUNTING STAFF :
    - Akses Baca : Bagan Akun, Buku Besar Umum, Laporan Keuangan dasar, Laporan Pajak Internal.
    - Akses Buat/Perbarui/Hapus: Entri Jurnal (subjek persetujuan manajer).
    - Akses Terkait Pajak: Menginput data yang memicu perhitungan pajak transaksional, melihat ringkasan hutang pajak perusahaan.
   
4. ACCOUNTING PAYABLE STAFF :
    - Akses Buat/Perbarui/Hapus: Faktur Vendor yang masuk (sering diintegrasikan dari Pengadaan), Pembayaran Keluar.
    - Akses Baca: Status faktur pembelian dan pembayaran, informasi pajak pada faktur pembelian.

5. ACCOUNTING RECEIVABLE STAFF :
    - Akses Buat/Perbarui/Hapus: Faktur Pelanggan yang masuk (sering diintegrasikan dari Manajemen Pesanan), Penerimaan Kas Masuk.
    - Akses Baca: Status faktur penjualan dan penerimaan kas, informasi pajak pada faktur penjualan.

6. AUDITOR : 
    - Akses Hanya Baca: Semua data keuangan dan pajak perusahaan (COA, Entri Jurnal, Buku Besar Umum, Laporan Pajak Internal) dan Laporan Keuangan. Tidak ada kemampuan modifikasi.
   
7. PROCUREMENT OFFICER :
    - Akses Baca Terbatas: Status pembayaran faktur pembelian yang mereka inisiasi, detail pajak terkait faktur pembelian.
   
8. SALES OFFICER :
   - Akses Baca Terbatas: Status penerimaan kas dari faktur penjualan yang mereka inisiasi, detail pajak terkait faktur penjualan.