const mockTeamDatabase = {
    'uuid-manajer-1': ['uuid-karyawan-A', 'uuid-karyawan-B'],
    'uuid-manajer-2': ['uuid-karyawan-C'],
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
        { id: 'uuid-karyawan-A', full_name: 'Budi Santoso' },
        { id: 'uuid-karyawan-B', full_name: 'Citra Lestari' },
        { id: 'uuid-karyawan-C', full_name: 'Agus Setiawan' },
    ];
    return allUsers.filter((user) => employeeIds.includes(user.id));
}

module.exports = {
    getTeamMemberIds,
    getUsersByIds,
};
