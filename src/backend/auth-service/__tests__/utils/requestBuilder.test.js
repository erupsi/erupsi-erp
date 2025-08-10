// Mock `fetch` globally before all tests
require("jest-fetch-mock").enableMocks();

const jwt = require("jsonwebtoken");
const requestBuilder =
require("../../src/utils/requestBuilder"); // Sesuaikan path jika perlu

// Mock jwt.sign to control the token generation
jest.mock("jsonwebtoken", () => ({
    ...jest.requireActual("jsonwebtoken"),
    sign: jest.fn(() => "mocked-jwt-token"),
}));

const fail = (message) => {
    throw new Error(message);
};

describe("requestBuilder", () => {
    const mockUrl = "http://api.example.com/employees";
    const mockMethod = "POST";
    const mockEmployeeData = {
        username: "johndoe",
        email: "john.doe@example.com",
    };

    beforeEach(() => {
    // Reset mocks before each test to ensure test isolation
        fetch.resetMocks();
        jwt.sign.mockClear();
    });

    test("should build and send a GET request without a body", async () => {
    // Mock a successful fetch response
        fetch.mockResponseOnce(JSON.stringify({message: "Success"}));

        const url = "http://api.example.com/data";
        const method = "GET";
        const response = await requestBuilder(url, method);

        // Ensure jwt.sign was called correctly
        expect(jwt.sign).toHaveBeenCalledWith(
            {roles: ["AUTH_SERVICE"]},
            expect.any(String),
            expect.objectContaining({
                algorithm: "RS256",
                expiresIn: "1m",
                issuer: "auth-service",
            }),
        );

        // Ensure fetch was called correctly
        expect(fetch).toHaveBeenCalledWith(url, {
            method: method,
            headers: {
                "Authorization": "Bearer mocked-jwt-token",
                "Content-Type": "application/json",
            },
        });

        // Ensure the function returns the correct data
        expect(response).toEqual({message: "Success"});
    });

    test("should build and send a POST request with a body", async () => {
        // Mock a successful fetch response
        fetch.mockResponseOnce(JSON.stringify(mockEmployeeData));

        const response = await requestBuilder(
            mockUrl, mockMethod, mockEmployeeData);

        // Ensure jwt.sign was called
        expect(jwt.sign).toHaveBeenCalledTimes(1);

        // Perbaikan: Gunakan expect.objectContaining untuk memeriksa objek
        expect(fetch).toHaveBeenCalledWith(
            mockUrl,
            expect.objectContaining({
                method: mockMethod,
                headers: {
                    "Authorization": "Bearer mocked-jwt-token",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(mockEmployeeData),
            }),
        );

        // Ensure the function returns the correct data
        expect(response).toEqual(mockEmployeeData);
    });

    test("should handle network errors gracefully", async () => {
    // Mock a fetch error
        fetch.mockRejectOnce(new Error("Network failure"));

        // Perbaikan: Bungkus pemanggilan fungsi dalam try-catch block
        try {
            await requestBuilder(mockUrl, mockMethod);
            // Jika kode ini tercapai, berarti test gagal karena tidak ada error
            fail("Expected an error to be thrown, but it did not.");
        } catch (error) {
            // Memastikan error yang dilempar sesuai
            expect(error.message).toBe("Network failure");
        }
    });

    test("should not include a body for a GET request with data", async () => {
        fetch.mockResponseOnce(JSON.stringify({message: "OK"}));

        const url = "http://api.example.com/users";
        const method = "GET";

        await requestBuilder(url, method, {some: "data"});

        // The fetch call should not include a body for a GET request
        expect(fetch).toHaveBeenCalledWith(url, {
            method: method,
            headers: {
                "Authorization": "Bearer mocked-jwt-token",
                "Content-Type": "application/json",
            },
        });
    });
});
