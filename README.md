# Erupsi Project

Erupsi: ERP untuk Perusahaan Sistem Informasi

A modular, containerized ERP system built with modern web technologies.

## 📦 Tech Stack

| Layer        | Technology         |
|--------------|--------------------|
| Backend      | Node.js (Express.js) |
| API Gateway  | TBD (e.g. Express, NGINX, or custom) |
| Frontend     | React (static site, hosted separately) |
| Database     | PostgreSQL         |
| Containerization | Docker & Docker Compose |
| Package Manager | npm with workspaces |
| Dev Tools    | ESLint, Prettier, dotenv, Swagger |

## 📁 Project Structure

```bash
.
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── docker-compose.yml
├── docs
│   └── CODEOWNERS
├── LICENSE
├── Makefile
├── package.json               <-- 📦 root package manifest file
├── package-lock.json          <-- 🔒 root package lockfile
├── README.md
├── SECURITY.md
└── src
    ├── backend
    │   └── some-service
    │       ├── Dockerfile
    │       ├── package.json   <-- managed using npm workspace
    │       └── src
    └── frontend
        └── src
```

Each service contains its own `package.json`, `Dockerfile`, `.env.example`, and source code.

## 🚀 Getting Started

### 🔧 Prerequisites

- Node.js ≥ 18
- Docker & Docker Compose
- Git

### 🛠️ Setup

1. **Clone the repository:**

    ```bash
    git clone https://github.com/erupsi/erupsi-erp
    cd erupsi-erp
    ```

2. **Copy the environment template and fill in actual values:**
  
    ```bash
    cp .env.example .env
    ```

3. **Start the application stack using Docker Compose:**

   ```bash
   docker-compose up --build
   ```

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
- Visit `/docs` endpoint if available
- Or open the raw `swagger.json` file in Swagger editor

## ⚖️ License

This project is licensed under the MIT License. See [LICENSE.md](LICENSE.md) for more details.

---

🤝 We expect all contributors to follow our [Code of Conduct](CODE_OF_CONDUCT.md).
