# syntax=docker/dockerfile:1.7

FROM node:22-slim AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma/

RUN pnpm install --frozen-lockfile

COPY . .

ENV SKIP_ENV_VALIDATION=1
ENV BETTER_AUTH_SECRET=build_time_dummy_secret

RUN pnpm build

# ------------------------

FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]