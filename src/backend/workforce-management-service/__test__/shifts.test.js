const request = require('supertest');
const express = require('express');
const shiftsRoutes = require('../src/routes/shifts');


const { Shift } = require('../src/models');
// Kita buat aplikasi Express palsu hanya untuk pengujian
const app = express();
app.use(express.json());
app.use('/shifts', shiftsRoutes);

// Mocking model Shift agar tidak menyentuh database asli
jest.mock('../src/models', () => ({
    Shift: {
        create: jest.fn((data) => Promise.resolve({ id: 'mock-id', ...data })),
        findAll: jest.fn(() => Promise.resolve([])),
        findByPk: jest.fn(), // Tambahkan ini
        destroy: jest.fn(), // Tambahkan ini
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

    it('should update an existing shift', async () => {
        // Perbarui mock untuk findByPk
        const mockShift = {
            id: 'mock-id',
            employee_id: 'test-employee-id',
            save: jest.fn().mockResolvedValue(true),
        };
        Shift.findByPk.mockResolvedValue(mockShift);

        const response = await request(app)
            .put('/shifts/mock-id')
            .send({ start_time: '10:00:00' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Shift berhasil diperbarui');
    });

    it('should delete an existing shift', async () => {
        const mockShift = {
            id: 'mock-id',
            destroy: jest.fn().mockResolvedValue(true),
        };
        Shift.findByPk.mockResolvedValue(mockShift);

        const response = await request(app).delete('/shifts/mock-id');

        expect(response.status).toBe(204);
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
