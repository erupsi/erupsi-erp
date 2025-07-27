const request = require('supertest');
const express = require('express');
const leaveRequestRoutes = require('../src/routes/leave_request');

const app = express();
app.use(express.json());
app.use('/leave-requests', leaveRequestRoutes);

// Mocking model LeaveRequest
jest.mock('../src/models', () => ({
    LeaveRequest: {
        create: jest.fn((data) => Promise.resolve({ id: 'mock-leave-id', ...data, status: 'pending' })),
        findByPk: jest.fn((id) => Promise.resolve({
            id,
            status: 'pending',
            save: jest.fn().mockResolvedValue(true),
        })),
    },
}));

describe('Leave Requests API', () => {
    it('should create a new leave request with valid data', async () => {
        const response = await request(app)
            .post('/leave-requests')
            .send({
                start_date: '2025-11-01',
                end_date: '2025-11-02',
                reason: 'Acara keluarga.',
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Pengajuan cuti berhasil dibuat');
    });

    it('should update the status of a leave request', async () => {
        const response = await request(app)
            .put('/leave-requests/mock-leave-id/status')
            .send({
                status: 'approved',
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toContain('berhasil diubah menjadi approved');
    });
});
