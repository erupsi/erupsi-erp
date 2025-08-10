require("dotenv").config({path: __dirname + "/../../../../../.env"});
const jwt = require("jsonwebtoken");
const PUBLIC_KEY = process.env.PUBLIC_KEY.replace(/\\n/g, "\n");

/**
 * A factory function that creates an Express middleware for authenticating service requests using a JWT.
 * The returned middleware checks for a valid Bearer token in the 'Authorization' header
 * and verifies it against the public key. It can also optionally enforce role-based access.
 *
 * @function authenticateServiceRequest
 * - Optional configuration for the middleware.
 * @param {object} [options={useRole: false}]
 * - If true, the middleware will also check if the user has the 'SYSTEM_ADMIN' role in the JWT payload.
 * @param {boolean} [options.useRole=false]
 * @returns {
 *  function(import('express').Request,
 *    import('express').Response,
 *    import('express').NextFunction): void
 * } An Express middleware function that authenticates the request.
 */

const authenticateServiceRequest = (options = {AdminRole: false, AuthService: false}) => {
    return async (req, res, next) => {
        const allowedRoles = [];

        if (options.AdminRole === true) {
            allowedRoles.push("SYSTEM_ADMIN");
        }

        if (options.AuthService === true) {
            allowedRoles.push("AUTH_SERVICE");
        }

        const authHeader = req.headers["authorization"];

        if (!authHeader) {
            return res.status(401).json({message: "Authentication token required"});
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({message: "Token format is 'Bearer <token>"});
        }

        try {
            const decoded = jwt.verify(token, PUBLIC_KEY, {
                algorithms: ["RS256"],
                iss: "auth-service",
            });

            if (options.AdminRole == true || options.AuthService == true) {
                if (!decoded ||
          !decoded.roles ||
          !Array.isArray(decoded.roles) ||
          !decoded.roles.some((role) => allowedRoles.includes(role))
                ) {
                    return res.status(403).json({message: "Access denied: Admin privileges required"});
                }
            }

            next();
        } catch (error) {
            console.error("Error verifying authentication token");
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({message: "Token expired"});
            }
            console.error(error);
            return res.status(401).json({message: "Invalid or malformed token"});
        }
    };
};

module.exports = authenticateServiceRequest;
