# ─── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root workspace files
COPY package.json package-lock.json turbo.json ./

# Copy package manifests first for better layer caching
COPY packages/shared/package.json ./packages/shared/
COPY packages/backend/package.json ./packages/backend/

# Install all workspace dependencies
RUN npm ci

# Copy source
COPY packages/shared ./packages/shared
COPY packages/backend ./packages/backend

# Build shared types
RUN npm run build --workspace=packages/shared 2>/dev/null || true

# Build backend
RUN npm run build --workspace=packages/backend

# ─── Stage 2: Production runtime ─────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy built output and dependencies
COPY --from=builder /app/packages/backend/dist ./dist
COPY --from=builder /app/packages/backend/prisma ./prisma
COPY --from=builder /app/packages/backend/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Run as non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S loco -u 1001
USER loco

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
