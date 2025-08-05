/**
 * @fileoverview HTTP request builder utility with JWT authentication
 * @module utils/requestBuilder
 */

const jwt = require("jsonwebtoken");
require("dotenv").config({path: __dirname + "/../../.env"});

const PRIVATE_KEY = process.env.PRIVATE_KEY.replace(/\\n/g, "\n");

/**
 * Builds and executes HTTP requests with JWT authentication
 * @async
 * @function requestBuilder
 * @param {string} url - The target URL for the request
 * @param {string} method - HTTP method (GET, POST, PUT, PATCH, DELETE)
 * @param {Object} [employeeData={}] - Data to send in request body
 * @return {Promise<Object>} The response data from the API
 * @throws {Error} If the request fails or response parsing fails
 * @example
 * // GET request
 * const data = await requestBuilder("http://localhost:3001/api/users", "GET");
 *
 * // POST request with data
 * const result = await requestBuilder(
 *   "http://localhost:3001/api/users",
 *   "POST",
 *   { name: "John", email: "john@example.com" }
 * );
 */
const requestBuilder = async (url, method, employeeData = {}) => {
    console.log(employeeData);
    const token = jwt.sign({roles: ["AUTH_SERVICE"]}, PRIVATE_KEY, {
        algorithm: "RS256",
        expiresIn: "1m",
        issuer: "auth-service",
    });

    const requestOption = {
        method: `${method}`,
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };

    const hasBody = ["POST", "PUT", "PATCH"].includes(method.toUpperCase());
    if (hasBody && Object.keys(employeeData).length > 0) {
        requestOption.body = JSON.stringify(employeeData);
    }

    const response = await fetch(`${url}`, requestOption);
    const data = await response.json();

    return data;
};

module.exports = requestBuilder;
