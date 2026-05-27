# ---- build (types, transpile, static assets) ----
FROM node:22-slim AS build
RUN apt-get update && apt-get install -y curl wget python3 python3-pip python3-venv || true
WORKDIR /app
# Enable corepack and install pnpm
RUN corepack enable && corepack prepare pnpm@10 --activate
COPY package.json pnpm-lock.yaml ./
# Disable husky prepare script in container to avoid missing git binary
ENV HUSKY=0
RUN pnpm install --frozen-lockfile --ignore-scripts
# Install Python dependencies for docs:build
COPY requirements.txt ./
RUN pip3 install --break-system-packages -r requirements.txt
COPY . .
# Build static site (runs docs:build and astro build)
RUN pnpm run build

# ---- production runtime ----
FROM node:22-slim AS runner
RUN apt-get update && apt-get install -y curl wget || true
ENV NODE_ENV=production
WORKDIR /app
# Copy static files and server code
COPY --from=build /app/dist ./dist
COPY --from=build /app/server.js ./server.js
ENV PORT=3000
EXPOSE 3000
# Run the static file server
CMD ["node", "server.js"]
