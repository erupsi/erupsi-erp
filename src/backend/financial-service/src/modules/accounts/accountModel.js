//untuk berinteraksi dengan db

class AccountModel {
    /**
     * Create a new account in Database.
     * @param {object} accountData - Data akun
     * @param {string} accountData.accountCode - Kode unik untuk akun
     * @param {string} accountData.accountName - Nama akun
     * @param {string} accountData.accountType - Tipe akun (misal, 'Asset', 'Liability')
     * @param {string} [accountData.parentAccountId] - Opsional ID akun induk untuk hierarki
     * @returns {Promise<object>} Objek akun yang dibuat
     */
    async createAccount({accountCode, accountName, accountType, parentAccountId = null }) {
        const res = await query(
            `INSERT INTO accounts (account_code, account_name, account_type, parent_account_id)
             VALUES ($1, $2, $3, $4),
             RETURNING account_id, account_code, account_name, account_type, parent_account_id, is_active, created_at, update_at`,
             [accountCode, accountName, accountType, parentAccountId]
        );
        return res.rows[0];
    }

    /**
     * Get all accounts from database.
     * @returns {Promise<Array<object>>} Array objek akun.
     */
    async findAllAccounts() {
        const res = await query('SELECT account_id, account_code, account_name, account_type, parent_account_id, is_active, created_at, updated_at FROM accounts ORDER BY account_code ASC');
        return res.rows;
    }

    /**
     * 
     */

}
