module.exports = {
    // Menentukan lingkungan kode kita dijalankan
    env: {
        node: true, // Lingkungan Node.js (mengenal 'require', 'module', dll.)
        commonjs: true,
        es2021: true, // Menggunakan fitur-fitur modern JavaScript
    },
    // Menggunakan aturan bawaan yang direkomendasikan oleh ESLint
    extends: 'eslint:recommended',
    // Opsi tambahan untuk parsing kode
    parserOptions: {
        ecmaVersion: 'latest',
    },
    // Di sinilah kita menyesuaikan aturan (rules)
    rules: {
    // Nonaktifkan aturan linebreak (menyelesaikan masalah CRLF vs LF)
        'linebreak-style': 'off',

        // Izinkan penggunaan snake_case (menyelesaikan masalah 'employee_id')
        // Ini penting saat bekerja dengan database yang sering menggunakan snake_case.
        'camelcase': 'off',

        // Wajibkan penggunaan kutip satu (') untuk string
        'quotes': ['error', 'single'],

        // Beri peringatan (bukan error) untuk variabel yang tidak terpakai
        'no-unused-vars': 'warn',

        // Wajibkan spasi di dalam kurung kurawal, contoh: { id, name }
        // Ini menyelesaikan masalah "There should be no space after '{'"
        'object-curly-spacing': ['error', 'always'],

        // Tidak boleh ada spasi ekstra di akhir baris
        'no-trailing-spaces': 'error',
    },
};
