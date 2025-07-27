// File ini akan secara otomatis digunakan oleh Jest untuk menggantikan modul 'pg' yang asli.

// Kita buat objek client palsu yang bisa kita kontrol query-nya
const mockClient = {
  query: jest.fn(),
  release: jest.fn(),
};

// Kita buat objek pool palsu
const mockPool = {
  query: jest.fn(),
  connect: jest.fn().mockResolvedValue(mockClient), // connect() akan mengembalikan client palsu kita
};

// Mock constructor Pool
const Pool = jest.fn(() => mockPool);

module.exports = { Pool };