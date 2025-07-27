/**
 * FUNGSI MOCK/PLACEHOLDER
 * Mensimulasikan pemanggilan API ke User Service untuk mendapatkan
 * ID karyawan yang berada di bawah seorang manajer.
 * @param {string} managerId - UUID dari manajer.
 * @return {Promise<string[]>} - Array berisi UUID anggota tim.
 */
async function getTeamMemberIds(managerId) {
    console.log(`[MOCK] Mengambil data tim untuk manajer: ${managerId}`);
    // Di dunia nyata, ini akan menjadi panggilan API:
    // const response = await fetch(`http://user-service/api/users?manager_id=${managerId}`);
    // const teamMembers = await response.json();
    // return teamMembers.map((member) => member.id);

    // Untuk sekarang, kita kembalikan data palsu untuk pengujian.
    return [
        'c1a2b3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', // Ganti dengan ID statis yang Anda gunakan
        'another-employee-uuid-for-testing',
    ];
}

module.exports = {
    getTeamMemberIds,
};
