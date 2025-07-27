const request = require('supertest');
const express = require('express');
const attendanceRoutes = require('../src/routes/attendances');

const app = express();
app.use(express.json());
app.use('/attendances', attendanceRoutes);

// Mocking models Attendance dan Shift
jest.mock('../src/models', () => ({
    Attendance: {
        create: jest.fn((data) => Promise.resolve({ id: 'mock-attendance-id', ...data })),
    },
    Shift: {
        findOne: jest.fn(() => Promise.resolve({
            id: 'mock-shift-id',
            start_time: '09:00:00',
        })),
    },
}));

describe('Attendances API', () => {
    it('should successfully check-in an employee', async () => {
        const response = await request(app)
            .post('/attendances/check-in')
            .send();

        expect(response.status).toBe(201);
        expect(response.body.message).toContain('Check-in berhasil');
    });
});
