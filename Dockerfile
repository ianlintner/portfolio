# Multi-stage Docker build for Next.js application
FROM node:18-alpine AS builder
WORKDIR /app
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN rm -rf node_modules && pnpm install --frozen-lockfile
RUN npx prisma generate

COPY src ./src
RUN rm -rf .next && npx next build

FROM node:18-alpine AS runner
WORKDIR /app

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
