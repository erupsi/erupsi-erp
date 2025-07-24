class Attendances {
    constructor(id, employee_id, check_in, check_out, status) {
        this.id = id;
        this.employee_id = employee_id;
        this.check_in = check_in;
        this.check_out = check_out;
        this.status = status;
    }
}

module.exports = Attendances;