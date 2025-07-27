const request = require('supertest');
const express = require('express');
const shiftsRoutes = require('../src/routes/shifts');

// Kita buat aplikasi Express palsu hanya untuk pengujian
const app = express();
app.use(express.json());
app.use('/shifts', shiftsRoutes);

// Mocking model Shift agar tidak menyentuh database asli
jest.mock('../src/models', () => ({
    Shift: {
        create: jest.fn((data) => Promise.resolve({ id: 'mock-id', ...data })),
        findAll: jest.fn(() => Promise.resolve([])),
    },
}));

describe('Shifts API', () => {
    it('should create a new shift when given valid data', async () => {
        const response = await request(app)
            .post('/shifts')
            .send({
                employee_id: 'test-employee-id',
                shift_date: '2025-01-01',
                start_time: '09:00:00',
                end_time: '17:00:00',
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Shift berhasil dibuat');
        expect(response.body.data.employee_id).toBe('test-employee-id');
    });

    it('should return 400 if input data is incomplete', async () => {
        const response = await request(app)
            .post('/shifts')
            .send({
                employee_id: 'test-employee-id',
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Input tidak lengkap.');
    });
});
