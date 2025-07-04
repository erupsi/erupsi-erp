# Contributing to Erupsi Project
Thank you for your interest in contributing to the Erupsi project! Whether you want to report a bug, suggest new features, or contribute code, this guide will help you get started 🎉.

## Development Environment Setup
1. Clone the repository to your local machine (choose HTTPS or SSH):
   - **HTTPS** (recommended for most users):
     ```bash
     git clone https://github.com/erupsi/erupsi-erd.git
     cd erupsi-erd
     ```
   - **SSH** (if you have set up SSH keys with GitHub):
     ```bash
     git clone git@github.com:erupsi/erupsi-erd.git
     cd erupsi-erd
     ```
2. Install dependencies for both the frontend and backend:
   ```bash
   # TODO: Add actual dependency installation commands for frontend and backend
   # Example:
   # cd frontend && npm install
   # cd ../backend && npm install
   ```

## Coding Guidelines
- Use [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/) for code formatting and linting. See the `.prettierrc` and `.eslintrc.js` files to learn the rules, and see [Prettier](https://prettier.io/docs/index.html) and [ESLint](https://https://eslint.org/docs/latest/use/configure/) docs.
- Use [Tailwind CSS](https://tailwindcss.com/docs/utility-first) utility classes for styling in React components.
- Write clear, descriptive commit messages. Follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard if applicable:
  - Use `feat:` for new features.
  - Use `fix:` for bug fixes.
  - Use `docs:` for documentation changes.
  - Use `style:` for changes that do not affect the meaning of the code (white-space, formatting, etc.).
  - Use `refactor:` for code changes that neither fix a bug nor add a feature.
  - Use `test:` for adding missing tests or correcting existing tests.
- Use clear, descriptive names for variables, functions, and components (`startTime`, `employeeId`, etc).
- Follow the existing folder structure and naming conventions.
- Add/update tests where appropriate.

## How to Contribute
1. Fork the repository and create your branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes and commit them:
   ```bash
   git add .
   git commit -m "Describe your changes"
   ```
3. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
4. Open a Pull Request (PR) to the main repository.
5. Participate in code review and address any requested changes.

## Reporting Issues
- Use the GitHub Issues tab to report bugs or request features.
- Check the existing issues first:
  - If your issue is there, add a comment with any additional information or up-vote.
  - If your issue is not listed, create a new issue.
    - Use a clear title and description.
    - Label the issue appropriately (bug, feature request, etc.).
    - Provide as much detail as possible, including steps to reproduce, expected behavior, and screenshots if relevant.
