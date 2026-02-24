FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies for TypeScript build)
RUN npm ci

# Copy engine source code and configs
COPY engine/ ./engine/
COPY tsconfig.json ./

# Build the engine
RUN npm run engine:build

# Remove devDependencies to reduce image size
RUN npm prune --production

# Expose engine port
EXPOSE 8787

# Start the engine
CMD ["node", "engine/dist/index.js"]
