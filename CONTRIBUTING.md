# Contributing to Erupsi Project

Thank you for your interest in contributing to the Erupsi project! Whether you want to report a bug, suggest new
features, or contribute code, this guide will help you get started 🎉.

## Table of Contents 🧭

* [Project Structure](#project-structure-)
* [Getting Started](#getting-started-)
* [Coding Guidelines](#coding-guidelines-)
  * [General Guidelines](#general-guidelines-)
  * [Branching & Commits](#branching--commits-)
  * [Testing & Linting](#testing--linting-)
  * [Pull Request Checklist](#pull-request-checklist-)
* [How to Contribute](#how-to-contribute-)
* [Need help or have ideas?](#need-help-or-have-ideas-)

## Project Structure 🗂

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

## Getting Started 🚀

To get started with development, follow these steps:

1. Clone the repository to your local machine (choose HTTPS or SSH):
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
2. Install dependencies for both the frontend and backend:
   ```bash
   # Make sure you're on the root of the project
   npm install
   ```

## Coding Guidelines 🛠

To ensure code quality, maintainability, and consistency across the project, please follow these guidelines when
contributing:

### General Guidelines 📜

* Use [ESLint](https://eslint.org/) for code linting. See the `.eslintrc.js` files to learn about the rules and [ESLint](https://eslint.org/docs/latest/use/configure/) docs.
* Use [Tailwind CSS](https://tailwindcss.com/docs/utility-first) utility classes for styling in React components.
* Keep services modular and loosely coupled.
* Use environment variables for configuration (`.env`) and **DO NOT** commit it.
* Document API changes in *TBD*.
* Use clear, descriptive names for variables, functions, and components (`startTime`, `employeeId`, etc).
* Follow the existing folder structure and naming conventions.

### Branching & Commits 🔀

* Use feature branches for new features or bug fixes:
  * Branch names should be descriptive, e.g., `feature/user-authentication`, `bugfix/inventory-update`.
* Write clear, descriptive commit messages. Follow
  the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard if applicable:
  * Use `feat:` for new features.
  * Use `fix:` for bug fixes.
  * Use `docs:` for documentation changes.
  * Use `style:` for changes that do not affect the meaning of the code (white-space, formatting, etc.).
  * Use `refactor:` for code changes that neither fix a bug nor add a feature.
  * Use `test:` for adding missing tests or correcting existing tests.

### Testing & Linting 🧪

* Each service should have its own test under `__test__`.
* Make sure all tests pass and lint errors are fixed before pushing:
  ```bash
  npm run test
  npm run lint
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
