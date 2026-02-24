# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files first (better caching)
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies for tsc)
RUN npm ci

# Copy engine source code
COPY engine/ engine/
COPY tsconfig.json ./

# Build the engine TypeScript → JavaScript
RUN npx tsc -p engine/tsconfig.json

# ---- Production Stage ----
FROM node:20-alpine

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy compiled engine output from builder
COPY --from=builder /app/engine/dist/ engine/dist/

# Railway sets PORT env var automatically
ENV PORT=8787
ENV ENGINE_AUTO_START=true

EXPOSE 8787

CMD ["node", "engine/dist/index.js"]
