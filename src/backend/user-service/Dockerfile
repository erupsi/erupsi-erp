# Make sure to point docker context to the monorepo root when building this Dockerfile.

# Stage 1: Builder
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy the entire monorepo (minimized with .dockerignore)
COPY ../../.. .

# Install only dependencies for this workspace
RUN npm install --workspace=src/backend/user-service --production

# Stage 2: Copy only the built node_modules and source to a clean runtime image
FROM node:20-alpine AS runtime

WORKDIR /app

# Copy installed node_modules from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src/backend/user-service .

# Set Node.js environment (optional)
ENV NODE_ENV=production

# Set default command
CMD ["node", "src/index.js"]
