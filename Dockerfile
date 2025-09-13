# ---- deps (node_modules for production) ----
FROM node:22-slim AS deps
RUN apt-get update && apt-get install -y libssl1.1 curl wget || true
WORKDIR /app
COPY package*.json ./
# Disable husky prepare script in container to avoid missing git binary
ENV HUSKY=0
RUN npm install --omit=dev --legacy-peer-deps --force --ignore-scripts

# ---- build (types, transpile) ----
FROM node:22-slim AS build
RUN apt-get update && apt-get install -y libssl1.1 curl wget || true
WORKDIR /app
COPY package*.json ./
# Disable husky prepare script in container to avoid missing git binary
ENV HUSKY=0
RUN npm install --legacy-peer-deps --force --ignore-scripts
COPY . .
# Build Next.js app
RUN npm run build

# ---- production runtime ----
FROM node:22-slim AS runner
RUN apt-get update && apt-get install -y libssl1.1 curl wget || true
ENV NODE_ENV=production
WORKDIR /app
# copy built app and prod node_modules
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
COPY --from=deps  /app/node_modules ./node_modules
COPY package*.json ./
ENV PORT=3000
EXPOSE 3000
# Next.js standalone build already includes the correct entrypoint
CMD ["node", "server.js"]
