# Erupsi Project

Erupsi: ERP untuk Perusahaan Sistem Informasi

A modular, containerized ERP system built with modern web technologies.

## 📦 Tech Stack

| Layer        | Technology         |
|--------------|--------------------|
| Backend      | Node.js (Express.js) |
| API Gateway  | Traefik |
| Frontend     | React, Tailwind CSS |
| Database     | PostgreSQL         |
| Containerization | Docker & Docker Compose |
| Package Manager | npm with workspaces |
| Dev Tools    | ESLint, remark, dotenv, Swagger, Jest |

## 🧩 Architecture Diagram

### Erupsi's Microservice Architecture

<img width="2430" height="1734" alt="image" src="https://github.com/user-attachments/assets/841ff1dc-2762-4545-a1a0-7158a27435d2" />

### Erupsi's Docker Compose

<img width="1443" height="1648" alt="image" src="https://github.com/user-attachments/assets/c1438054-3eb9-4996-8a91-8b7704144af2" />


## 📁 Project Structure

```bash
.
├── .env.example
├── .eslintrc.json
├── .gitignore
├── certs                            <-- 🔑 put your local environment (self-signed) certs here
│   ├── local.crt
│   └── local.key
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── compose.yaml
├── docs
│   └── CODEOWNERS
├── dynamic
│   └── tls.yaml
├── jest.config.js
├── LICENSE
├── Makefile
├── README.md
├── SECURITY.md
├── package.json                     <-- 📦 root package manifest file
├── package-lock.json                <-- 🔒 root package lockfile
└── src
    ├── backend
    │   └── some-service
    │       ├── .dockerignore
    │       ├── .env.example
    │       ├── Dockerfile
    │       ├── openapi.yaml
    │       ├── package.json         <-- managed using npm workspace from project root
    │       ├── README.md
    │       ├── __test__
    │       │   └── some.test.js     <-- 🧪 Jest unit test file
    │       └── src
    │           ├── index.js         <-- 🚪 service entry point
    │           └── routes           <-- 🚩 put your service routes here
    │           
    └── frontend
        ├── package.json
        ├── README.md
        └── src
            └── index.js
```

Each service contains its own `README`, `package.json`, `Dockerfile`, .`.dockerignore`, `.env.example`, source code `src/`, and unit tests `__test__/*.test.js` (also an `openapi.yaml` for backend services).

## 🚀 Getting Started

### 🔧 Prerequisites

* Node.js ≥ 20
* Docker & Docker Compose (Docker Desktop for convenient)
* Git

### 🛠️ Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/erupsi/erupsi-erp
   cd erupsi-erp
   ```

2. **Install all dependencies to your local machine:**

   ```bash
   # Make sure you're at the project root
   npm install
   ```

3. **Copy the environment template and fill the in actual values:**

   ```bash
   cp .env.example .env
   ```

4. **Start the application stack using Docker Compose:**

   ```bash
   docker compose up -d
   ```

> \[!TIP]
> For Unix-like environment, you also can use the Makefile we provide at the project root.

## 🧪 Testing

Each service has its own test.

```bash
# Example for auth-service
npm install
npm run test --workspace=auth-service
```

## 💡 Contributing

We welcome contributions. Please read our [CONTRIBUTING.md](CONTRIBUTING.md) before starting to give contributions to this project.

## 📜 Environment Variables

See `.env.example` file we provide for required environment variables. Each service may also has its own environment variable file.

## 🛡️ Security

**DO NOT** open new public issue related to security. Please report any security-related issues via the [Security](https://github.com/erupsi/erupsi-erp/security) tab above.

## 🖋️ API Documentation

Each service includes Swagger (OpenAPI) contract file.

To view:

* Visit `/docs` endpoint if available
* Or open the raw `swagger.json` file in Swagger editor

## ⚖️ License

This project is licensed under the MIT License. See [LICENSE.md](LICENSE.md) for more details.

***

🤝 We expect all contributors to follow our [Code of Conduct](CODE_OF_CONDUCT.md).
