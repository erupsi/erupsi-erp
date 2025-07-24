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
| Dev Tools    | ESLint, remark, dotenv, Swagger |

## 📁 Project Structure

```bash
.
├── .env.example
├── .eslintrc.json
├── .gitignore
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── docker-compose.yml
├── docs
│   └── CODEOWNERS
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
    │           └── some.test.js     <-- 🧪 Jest unit test file
    │       └── src
    │           └── index.js         <-- 🚪 service entry point
    └── frontend
        ├── package.json
        ├── README.md
        └── src
            └── index.js
```

Each service contains its own `package.json`, `Dockerfile`, `.env.example`, source code `src/`, and unit tests `__test__/*.test.js`.

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
   docker-compose up --build
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
