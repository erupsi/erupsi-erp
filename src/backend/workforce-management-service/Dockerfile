# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copy seluruh monorepo
COPY ../../.. .

# Install dependensi khusus untuk workspace ini
RUN npm install --workspace=src/backend/workforce-management-service --production

# Stage 2: Runtime
FROM node:20-alpine AS runtime

WORKDIR /app

# Salin node_modules dari tahap builder
COPY --from=builder /app/node_modules ./node_modules
# Salin kode sumber layanan
COPY --from=builder /app/src/backend/workforce-management-service .

ENV NODE_ENV=production

CMD ["node", "src/index.js"]