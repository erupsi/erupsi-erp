# Contributing to Erupsi Project

Thank you for your interest in contributing to the Erupsi project! Whether you want to report a bug, suggest new
features, or contribute code, this guide will help you get started 🎉.

## Table of Contents 🧭

* [Project Structure](#project-structure-)
* [Getting Started](#getting-started-)
* [Coding Guidelines](#coding-guidelines-)
  * [General Guidelines](#general-guidelines-)
  * [Branching & Commits](#branching--commits-)
  * [Installing Dependencies](#installing-dependencies-)
  * [Testing & Linting](#testing--linting-)
  * [Building Docker Container](#building-docker-container-)
  * [Running All Containers as a Whole](#running-all-containers-as-a-whole-)
  * [Pull Request Checklist](#pull-request-checklist-)
* [How to Contribute](#how-to-contribute-)
* [Need help or have ideas?](#need-help-or-have-ideas-)

## Project Structure 🗂

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

## Getting Started 🚀

To get started with development, follow these steps:

1. Ensure you've become a collaborator for this repository. If you haven't become a collaborator for this repo and want to contribute, see [How to Contribute](#how-to-contribute-) section below.
2. Make sure you have Node.js, Docker Desktop/Engine with Docker Compose, and your chosen API client installed.
3. Clone the repository to your local machine (choose HTTPS or SSH):
   * **HTTPS** (recommended for most users):
     ```bash
     git clone https://github.com/erupsi/erupsi-erp.git
     cd erupsi-erp
     ```
   * **SSH** (if you have set up SSH keys with GitHub):
     ```bash
     git clone git@github.com:erupsi/erupsi-erp.git
     cd erupsi-erp
     ```
4. Install current dependencies for both the frontend and backend:
   ```bash
   # Make sure you're on the root of the project
   npm install
   ```
5. Checkout to a new branch by following our [branching and commit guideline](#branching--commits-).
6. Setup your service directory by following the [project structure](#project-structure-) above.
7. Code and document your changes while following our [coding guidelines](#coding-guidelines-).
8. [Test and lint](#testing--linting-) your code.
9. Commit your changes by following our [branching and commit guideline](#branching--commits-).
10. Once you're done making changes, open a [Pull Request](https://github.com/erupsi/erupsi-erp/pulls).

## Coding Guidelines 🛠

To ensure code quality, maintainability, and consistency across the project, please follow these guidelines when
contributing:

### General Guidelines 📜

* Use [ESLint](https://eslint.org/) for code linting. See the `.eslintrc.json` files to learn about the rules used for this project and the [ESLint](https://eslint.org/docs/latest/use/configure/) docs.
* Use [Tailwind CSS](https://tailwindcss.com/docs/utility-first) utility classes for styling in React components.
* Keep services modular and loosely coupled. One service focuses on doing good at its job.
* Use environment variables for configuration (`.env`) and **DO NOT** commit it. You may use either project-level or service-level env file, or both.
* Document API endpoints in each service's `openapi.yaml`.
* Use clear, descriptive names for variables, functions, and components (`startTime`, `employeeId`, etc).
* Follow the existing folder structure and naming conventions.
* Create unit tests for each service you've created. Ensure you get a minimum of 80% test coverage, higher is better.

### Branching & Commits 🔀

* Use feature branches for new features or bug fixes:
  * Branch names should be descriptive, e.g., `feature/user-authentication`, `bugfix/inventory-update`.
* Write clear, descriptive commit messages. Follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard if applicable:
  * Use `feat:` for new features.
  * Use `fix:` for bug fixes.
  * Use `docs:` for documentation changes.
  * Use `style:` for changes that do not affect the meaning of the code (white-space, formatting, etc.).
  * Use `refactor:` for code changes that neither fix a bug nor add a feature.
  * Use `test:` for adding missing tests or correcting existing tests.

### Installing Dependencies 📦

* All service `package.json` belong to **root** `package.json` as npm workspaces. All package.json share a single `package-lock.json` file.
* Do all package operations at the project's root.
* If you need to do package operations only for your service, specify your package name by using `--workspace=<package_name>` option.
* To install dependencies at the project's root:
  ```bash
  npm install
  ```
* To install **new** dependencies at the project root:
  ```bash
  npm install package1 package2...
  ```
* To install new **development** dependencies at the project root:
  ```bash
  npm install --save-dev package1 package2
  ```
* To initialize a new `package.json` in your service and add it to the npm workspace:
  ```bash
  # Example for npm init for auth-service located in src/backend/auth-service
  npm init --workspace=src/backend/auth-service
  ```
* To install new dependencies specific for your service:
  ```bash
  # Example for installing deps in auth-service
  npm install --workspace=auth-service package1 package2
  ```

### Testing & Linting 🧪

* Each service should have its own tests under `__test__`.
* Make sure all tests pass and there are no lint errors before pushing:
  ```bash
  # Run unit test for all workspaces
  npm run test --workspaces
  # Run unit test for your service only (e.g. auth-service)
  npm run test --workspace=auth-service
  # Check all linting
  npm run lint
  # Check ESLint linting
  npm run lint:es
  # Check markdown linting
  npm run lint:md
  ```
* Fix all fixable linting errors:
  ```bash
  # Fix all linting
  npm run lint:fix
  # Fix ESLint linting
  npm run lint:fix-es
  # Fix markdown linting
  npm run lint:fix-md

  # Recheck again until all linting errors are resolved
  npm run lint
  ```
* Ensure your tests cover atleast 80% of your code:
  ```bash
  $ npm test
  
  > erupsi-erd@1.0.0 test
  > jest
  
   PASS  src/backend/user-service/__tests__/sum.test.js
    ✓ adds 1 + 2 to equal 3 (4 ms)
  
  ----------|---------|----------|---------|---------|-------------------
  File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
  ----------|---------|----------|---------|---------|-------------------
  All files |     100 |      100 |     100 |     100 |                   
   sum.js   |     100 |      100 |     100 |     100 |                   
  ----------|---------|----------|---------|---------|-------------------
  Test Suites: 1 passed, 1 total
  Tests:       1 passed, 1 total
  Snapshots:   0 total
  Time:        1.105 s
  Ran all test suites.
  ```

### Building Docker Container 🐋

* Make sure your service have a `Dockerfile`. You can copy it from another service and change the paths inside it. Our Dockerfile template should be sufficient for your need:
  ```Dockerfile
  # Make sure to point docker context to the monorepo root when building this Dockerfile.

  # Stage 1: Builder
  FROM node:20-alpine AS builder
  
  # Set working directory
  WORKDIR /app
  
  # Copy the entire monorepo (minimized with .dockerignore)
  COPY ../../.. .
  
  # Install only dependencies for this workspace
  RUN npm install --workspace=src/backend/<your-service-dir> --production
  
  # Stage 2: Copy only the built node_modules and source to a clean runtime image
  FROM node:20-alpine AS runtime
  
  WORKDIR /app
  
  # Copy installed node_modules from builder stage
  COPY --from=builder /app/node_modules ./node_modules
  COPY --from=builder /app/src/backend/<your-service-dir> .
  
  # Set Node.js environment (optional)
  ENV NODE_ENV=production
  
  # Set default command
  CMD ["node", "src/index.js"]

  ```
* Make sure you've already copied the `.dockerignore` file from another service aswell.
* Ensure Docker Engine in your machine is running.
* Build your container and tag it as "auth-service:latest":
  ```bash
  # Example for building auth-service container
  docker build -f src/backend/auth-service/Dockerfile -t auth-service:latest .
  ```
* Run your container and expose it at port 3000:
  ```bash
  # --rm option will automatically deletes the container upon the container have been stopped
  docker run --rm -p 3000:3000 auth-service
  ```
* See all running containers in your machine:
  ```bash
  $ docker ps
  CONTAINER ID   IMAGE          COMMAND                  CREATED          STATUS          PORTS                                         NAMES
  4008ad2fe50c   auth-service   "docker-entrypoint.s…"   27 seconds ago   Up 26 seconds   0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp   nifty_burnell
  ```
* Stop your service's container:
  ```bash
  # The container name is nifty_burnell as seen in the docker ps output
  docker stop nifty_burnell
  ```

### Running All Containers as a Whole 🌐

* Make sure you've already add your service (and db if needed) in the `compose.yaml` file at the project's root. Here's our template that should fit most situation:
  ```yaml
  # === Your Service Name ===
  <your-service-name>:
    build:
      context: .
      dockerfile: src/backend/<your-service-name>/Dockerfile
    container_name: erupsi-<your-service-name>
    restart: unless-stopped
    ports:
      - "3001:3000" # Expose port 3000 of the service on host port 3001
    env_file:
      - .env
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@<your-service-name>-db:5432/${POSTGRES_<YOUR_SERVICE_NAME>_DB}
    depends_on:
      - <your-service-name>-db
    networks:
      - erupsi-erp-network
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.<your-service-name>.rule=Host(`erupsi.docker.localhost`)"
      - "traefik.http.routers.<your-service-name>.entrypoints=websecure"
      - "traefik.http.routers.<your-service-name>.tls=true"

  <your-service-name>-db:
    image: postgres:17
    container_name: erupsi-<your-service-name>-db
    restart: unless-stopped
    env_file:
      - .env
    volumes:
      - <your-service-name>_db_data:/var/lib/postgresql/data
    networks:
      - erupsi-erp-network
  ```
* Run all containers in background using Docker Compose:
  ```bash
  docker compose up -d
  ```
* Stop all running containers:
  ```bash
  docker compose down
  ```

### Pull Request Checklist ✅

* \[ ] PR has a clear title and description.
* \[ ] Docs and contracts are updated if applicable.
* \[ ] All new features are covered by tests.
* \[ ] All tests pass and linting is clean.
* \[ ] No console logs or commented-out code.

## How to Contribute 💻

If you want to propose changes but don't have write access to the repository, you can still contribute by following
these steps:

1. [Fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo#forking-a-repository)
   the `erupsi/erupsi-erp` repository.
2. Clone your fork to your local machine using the same commands as [above](#getting-started-), but make sure you clone
   the forked repository instead the original one:
   ```bash
   # Original repository
   erupsi/erupsi-erp

   # Your forked repository
   your-username/your-forked-repo-name
   ```
3. Checkout a new branch to start working on your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. Make your changes and commit them:
   ```bash
   git add .
   git commit -m "type: brief description of your changes"
   ```
5. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
6. Open a Pull Request (PR) to the upstream repository.
7. Participate in code review and address any requested changes.

## Need help or have ideas? 💡

* Use the GitHub Issues tab to report bugs or request features, or if you have something to ask.
* Check the existing issues first:
  * If your issue is there, add a comment with any additional information or up-vote.
  * If your issue is not listed, create a new issue.
    * Use a clear title and description.
    * Label the issue appropriately (bug, feature request, etc.).
    * Provide as much detail as possible, including steps to reproduce, expected behavior, and screenshots if
      relevant.

***

🤝 We expect all contributors to follow our [Code of Conduct](/CODE_OF_CONDUCT.md).
