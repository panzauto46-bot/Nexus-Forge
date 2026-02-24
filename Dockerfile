FROM node:20-slim

WORKDIR /app

# Copy everything needed for install and build
COPY package.json package-lock.json ./
COPY engine/ ./engine/
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Build the engine TypeScript
RUN npx tsc -p engine/tsconfig.json

# Expose engine port (Railway auto-detects PORT env var)
EXPOSE 8787

# Health check
HEALTHCHECK --interval=30s --timeout=5s \
    CMD node -e "fetch('http://localhost:' + (process.env.PORT || 8787) + '/state').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

# Start the engine
CMD ["node", "engine/dist/index.js"]
