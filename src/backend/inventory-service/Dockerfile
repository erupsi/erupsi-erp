# Make sure to point docker context to the monorepo root when building this Dockerfile.

# Stage 1: Builder
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy the entire monorepo (minimized with .dockerignore)
COPY ../../.. .

# Install only dependencies for this workspace
RUN npm install --workspace=src/backend/inventory-service --production

# Stage 2: Copy only the built node_modules and source to a clean runtime image
FROM node:20-alpine AS runtime

WORKDIR /app
COPY package.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
