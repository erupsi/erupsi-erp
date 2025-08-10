# Auth Service

The Auth Service is responsible for handling user authentication, token management, and user role integration within the ERP system. It acts as a gateway for secure access, ensuring only authorized users can interact with protected resources.

## 1. Purpose
- Authenticate users based on provided credentials.
- Issue and validate JWT tokens for session management.
- Fetch user roles from the User Service API and embed them into the JWT payload.

## 2. Scope
- User login and authentication.
- JWT token issuance, validation, and refresh.
- Integration with User Service API to retrieve user roles.
- Embedding user roles into JWT payloads for downstream authorization.

## 3. Functional Requirements
- **User Authentication:**
  - Accepts user credentials and verifies them.
  - Issues JWT tokens upon successful authentication.
- **Token Management:**
  - Validates JWT tokens for protected endpoints.
  - Supports token refresh mechanism.
- **User Role Management:**
  - Fetches user roles from User Service API via GET requests.
  - Embeds roles into JWT payloads.

## 4. Non-Functional Requirements
- Secure handling of credentials and tokens.
- Efficient communication with User Service API.
- Scalability to handle multiple authentication requests.

## 5. Technology Used
- **JWT (JSON Web Token):** For token-based authentication and authorization.

## 6. API Integration
- Communicates with User Service API to fetch user roles using HTTP GET requests.

## 7. Service Flow

1. **User Login:**
   - Client sends credentials to the auth-service login endpoint.
   - Auth-service validates credentials.
   - On success, auth-service fetches user roles from user-service API.
   - Auth-service issues a JWT containing user information and roles.

2. **Token Validation:**
   - Client includes JWT in the Authorization header for protected requests.
   - Auth-service validates the JWT and extracts user roles for authorization.

3. **Token Refresh (if supported):**
   - Client requests a new token using a refresh token.
   - Auth-service validates the refresh token and issues a new JWT.

## 8. How to Use the Service

### Authentication (Login)
Send a POST request to the login endpoint with user credentials:

```http
POST /login
Content-Type: application/json

{
  "username": "<user>",
  "password": "<password>"
}
```

**Response:**
```json
{
  "token": "<jwt-token>"
}
```

### Accessing Protected Endpoints
Include the JWT in the `Authorization` header:

```http
GET /protected-resource
Authorization: Bearer <jwt-token>
```

### Token Validation
The service will automatically validate the JWT for protected endpoints. If invalid or expired, a 401 Unauthorized response is returned.

### Fetching User Roles
User roles are fetched automatically from the user-service API during login and embedded in the JWT payload.

## 10. Out of Scope
- User registration and profile management (handled by User Service).
- Defining the overall tech stack (see project root README.md).

---
For more details on the overall architecture and tech stack, refer to the main `README.md` at the project root.
