FROM node:20-alpine

WORKDIR /app

# Salin hanya yang diperlukan untuk install
COPY src/backend/ecommerce-service/package*.json ./
RUN npm install

# Install nodemon secara global (atau lokal dan pakai npx)
RUN npm install -g nodemon

# Salin seluruh service folder (khusus ecommerce-service aja)
COPY src/backend/ecommerce-service .

CMD ["nodemon", "src/index.js"]
