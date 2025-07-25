// src/backend/workforce-management-service/src/config/database.js
const { Sequelize } = require('sequelize');

// Gunakan variabel lingkungan DATABASE_URL yang sudah ada di .env dan docker-compose
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false, // Matikan logging SQL di konsol
});

// Fungsi untuk menguji koneksi saat aplikasi dimulai
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Koneksi database PostgreSQL berhasil.');
    } catch (error) {
        console.error('Tidak dapat terhubung ke database:', error);
    }
}

testConnection();

module.exports = sequelize;
