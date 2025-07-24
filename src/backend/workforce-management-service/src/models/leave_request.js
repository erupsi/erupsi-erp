class LeaveRequest {
    constructor(id, employee_id, start_date, end_date, reason, status, created_at, updated_at) {
        this.id = id;
        this.employee_id = employee_id;
        this.start_date = start_date;
        this.end_date = end_date;
        this.reason = reason;
        this.status = status;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}

module.exports = LeaveRequest;