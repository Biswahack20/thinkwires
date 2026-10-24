# ==============================================================================
# ThinkWires Backend - Production Dockerfile (Node.js 20 Express)
# ==============================================================================

FROM node:20-alpine AS runner

# Install curl for container healthchecks
RUN apk add --no-cache curl

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=5000

# Copy root monorepo manifest and backend manifest
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/

# Install only production dependencies
RUN npm ci --omit=dev --workspace=backend

# Copy backend source code
COPY apps/backend ./apps/backend

# Create uploads directory with non-root ownership
RUN mkdir -p /app/apps/backend/uploads && chown -R node:node /app

USER node

WORKDIR /app/apps/backend

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

CMD ["npm", "start"]
