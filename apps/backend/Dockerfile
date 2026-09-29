# Stage 1: Prune monorepo for backend app
FROM node:20-alpine AS pruner
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=backend --docker

# Stage 2: Install dependencies
FROM node:20-alpine AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app



COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/package-lock.json ./
RUN npm ci

COPY --from=pruner /app/out/full/ .
RUN npm run build --filter=backend...

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV HUSKY=0
ENV NODE_ENV=production

COPY --from=installer /app/apps/backend/package.json .
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/backend/src ./src

EXPOSE 5000
CMD ["node", "src/server.js"]