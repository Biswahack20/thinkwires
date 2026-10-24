# ==============================================================================
# ThinkWires Frontend - Multi-Stage Production Dockerfile (Vite -> Nginx)
# ==============================================================================

# --- Stage 1: Build the Vite production bundle ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root monorepo files for workspace resolution
COPY package*.json ./
COPY apps/frontend/package*.json ./apps/frontend/

# Install dependencies using workspaces
RUN npm ci --workspace=frontend

# Copy frontend source code
COPY apps/frontend ./apps/frontend

# Build production bundle
WORKDIR /app/apps/frontend
RUN npm run build

# --- Stage 2: Serve with lightweight Nginx Alpine ---
FROM nginx:1.27-alpine AS runner

# Remove default nginx site
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled frontend assets from builder stage
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
