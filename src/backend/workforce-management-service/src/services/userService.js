const MOCK_MANAGER_ID = '4a7c6c4a-8d4e-4b9f-9c7e-2a1b3d5f6a7b';
const MOCK_EMPLOYEE_ID_A = 'c1a2b3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';
const MOCK_EMPLOYEE_ID_B = '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed';

const mockTeamDatabase = {
    [MOCK_MANAGER_ID]: [MOCK_EMPLOYEE_ID_A, MOCK_EMPLOYEE_ID_B],
};

/**
 * Mensimulasikan pengambilan ID anggota tim dari User Service.
 * @param {string} managerId - UUID dari manajer.
 * @return {Promise<string[]>} - Array berisi UUID anggota tim.
 */
async function getTeamMemberIds(managerId) {
    console.log(`[MOCK] Mengambil data tim untuk manajer: ${managerId}`);
    return mockTeamDatabase[managerId] || [];
}

/**
 * Mensimulasikan pengambilan data detail dari beberapa karyawan.
 * @param {string[]} employeeIds - Array berisi UUID karyawan.
 * @return {Promise<object[]>} - Array berisi objek detail karyawan.
 */
async function getUsersByIds(employeeIds) {
    console.log(`[MOCK] Mengambil detail untuk karyawan: ${employeeIds.join(', ')}`);
    const allUsers = [
        { id: 'c1a2b3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', full_name: 'Budi (dari Mock)' },
        { id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed', full_name: 'Citra (dari Mock)' }, // <-- Diperbaiki
    ];
    return allUsers.filter((user) => employeeIds.includes(user.id));
}

module.exports = {
    getTeamMemberIds,
    getUsersByIds,
};
