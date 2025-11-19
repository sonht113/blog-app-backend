# 1️⃣ Build stage
FROM node:20-alpine AS builder

# Allow optional build arg; fallback to sqlite so build works without real DB creds
# ARG DATABASE_URL
# ENV DATABASE_URL=${DATABASE_URL:-file:./prisma/dev.db}

WORKDIR /app

# System deps useful for some native modules / prisma
RUN apk add --no-cache bash libc6-compat

# Copy package + prisma first for better caching
COPY package*.json ./
COPY prisma ./prisma/

# Install all deps (dev + prod) so generation & build work
RUN npm ci

# Copy full source
COPY . .

# Generate prisma client BEFORE building (this creates the types)
RUN npx prisma generate --schema=prisma/schema.prisma

# Verify Prisma client was generated correctly
RUN ls -la node_modules/@prisma/client/ || echo "Prisma client not found"
RUN ls -la node_modules/.prisma/client/ || echo "Prisma runtime not found"

# Build app (ts -> dist)
RUN npm run build

# 2️⃣ Production stage (minimal)
FROM node:20-alpine AS production

WORKDIR /app

# Small set of tools
RUN apk add --no-cache dumb-init

# Copy package for installing production deps
COPY package*.json ./

# Install only production deps
RUN npm ci --only=production && npm cache clean --force

# Copy built app + prisma runtime artifacts from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
# Copy prisma runtime pieces into node_modules so Prisma client works
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Copy entrypoint script
COPY entrypoint.sh ./
RUN chmod +x ./entrypoint.sh

# Create non-root user and adjust ownership
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 nodejs && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["./entrypoint.sh"]