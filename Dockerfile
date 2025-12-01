# ---- deps (node_modules for production) ----
FROM node:22-slim AS deps
RUN apt-get update && apt-get install -y curl wget || true
WORKDIR /app
# Enable corepack and install pnpm
RUN corepack enable && corepack prepare pnpm@10 --activate
COPY package.json pnpm-lock.yaml ./
# Disable husky prepare script in container to avoid missing git binary
ENV HUSKY=0
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

# ---- build (types, transpile) ----
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
# Provide build-time defaults so NextAuth secret check does not fail during image build.
# These are only used in this build stage and are not copied into the final runtime image.
# IMPORTANT: Real secrets must be provided at runtime via environment variables or secret management.
ARG NEXTAUTH_URL=http://localhost:3000
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
# Build Next.js app (includes docs:build via pnpm docs:build && next build)
# We provide a stub NEXTAUTH_SECRET inline to satisfy build-time checks without leaking real secrets or triggering docker warnings
RUN NEXTAUTH_SECRET="build-time-stub-secret-not-for-production" pnpm run build

# ---- production runtime ----
FROM node:22-slim AS runner
RUN apt-get update && apt-get install -y curl wget || true
ENV NODE_ENV=production
WORKDIR /app
# copy built app and prod node_modules
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
COPY --from=deps  /app/node_modules ./node_modules
COPY package.json ./
ENV PORT=3000
EXPOSE 3000
# Force Next.js to bind to IPv4 0.0.0.0 on port 3000
CMD ["node", "server.js", "-H", "0.0.0.0", "-p", "3000"]
