# Stage 1: Build Vite React App
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=frontend --docker

WORKDIR /app/out
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./
RUN npm ci

COPY --from=builder /app/out/full/ .
RUN npm run build --filter=frontend...

# Stage 2: Serve with Nginx
FROM nginx:alpine AS runner
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]