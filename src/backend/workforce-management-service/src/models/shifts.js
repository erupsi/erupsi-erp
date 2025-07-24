// Placeholder untuk logika model Shift
// Nantinya ini akan berisi skema database (misalnya menggunakan Sequelize atau ORM lainnya)

class Shift {
    constructor(id, employee_id, shift_date, start_time, end_time) {
        this.id = id; // UUID
        this.employee_id = employee_id; // UUID, Foreign Key ke tabel employees [cite: 104]
        this.shift_date = shift_date; // DATE [cite: 105]
        this.start_time = start_time; // TIME [cite: 106]
        this.end_time = end_time; // TIME [cite: 107]
        // created_at akan ditangani oleh database [cite: 108]
    }

    // Di sini Anda akan menambahkan metode seperti:
    // static async create(shiftData) { ... }
    // static async findByEmployee(employeeId, startDate, endDate) { ... }
    // static async update(id, updateData) { ... }
    // static async delete(id) { ... }
}

module.exports = Shift;