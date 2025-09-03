# Multi-stage Docker build for Next.js application
FROM node:18-alpine AS builder
WORKDIR /app
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
COPY src ./src
COPY public ./public
COPY tsconfig.json ./
COPY next.config.js ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./
COPY .eslintrc.json ./
RUN rm -rf node_modules && pnpm install --frozen-lockfile
# Ensure clean Prisma generation after all source files are present
RUN rm -rf node_modules/.prisma && npx prisma generate
RUN rm -rf .next && pnpm build

FROM node:18-alpine AS runner
WORKDIR /app

# Install necessary packages for Prisma and OpenSSL
RUN apk add --no-cache openssl libstdc++

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Set permissions
USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
