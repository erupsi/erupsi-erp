// src/backend/workforce-management-service/src/middleware/auth.js
const http = require('http');

function authenticateToken(req, res, next) {
    // ... (Isi fungsi dari jawaban sebelumnya)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    const postData = JSON.stringify({ token });
    const options = { /* ... */ };
    const authReq = http.request(options, (authRes) => { /* ... */ });
    authReq.on('error', (e) => res.sendStatus(500));
    authReq.write(postData);
    authReq.end();
}

function authorizeManager(req, res, next) {
    if (req.user && req.user.role === 'manager') {
        next();
    } else {
        res.sendStatus(403);
    }
}

// Pastikan bagian ini ada dan benar
module.exports = {
    authenticateToken,
    authorizeManager
};