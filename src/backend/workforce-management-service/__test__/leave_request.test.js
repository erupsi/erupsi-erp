const request = require('supertest');
const express = require('express');
const leaveRequestRoutes = require('../src/routes/leave_request');
const { getTeamMemberIds } = require('../src/services/userService'); //

const app = express();
app.use(express.json());
app.use('/leave-requests', leaveRequestRoutes);

// Mocking model LeaveRequest
jest.mock('../src/models', () => ({
    LeaveRequest: {
        create: jest.fn((data) => Promise.resolve({ id: 'mock-leave-id', ...data, status: 'pending' })),
        findByPk: jest.fn((id) => Promise.resolve({
            id,
            // Pastikan employee_id ini ada di dalam daftar tim mock
            employee_id: 'c1a2b3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
            start_date: '2025-11-01',
            end_date: '2025-11-02',
            status: 'pending',
            save: jest.fn().mockResolvedValue(true),
        })),
        findAll: jest.fn().mockResolvedValue([]),
    },
    Shift: {
        // Mock Shift.update untuk mencegah error saat status cuti di-approve
        update: jest.fn().mockResolvedValue([1]),
    },
}));

jest.mock('../src/services/userService'); // Mock userService

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

    it('should return 400 if an invalid status is provided', async () => {
        const response = await request(app)
            .put('/leave-requests/mock-leave-id/status')
            .send({
                status: 'on_vacation', // Status yang tidak valid
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Status tidak valid.');
    });

    it('should update the status of a leave request', async () => {
        // Konfigurasi mock getTeamMemberIds untuk tes ini
        getTeamMemberIds.mockResolvedValue(['c1a2b3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d']);

        const response = await request(app)
            .put('/leave-requests/mock-leave-id/status')
            .send({
                status: 'approved',
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toContain('berhasil diubah menjadi approved');
    });
});
