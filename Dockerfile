FROM node:20-alpine AS builder

WORKDIR /app
RUN corepack enable
COPY . .
RUN yarn install --immutable
RUN yarn build

FROM node:20-alpine AS runner

WORKDIR /app

RUN corepack enable

# Copy Yarn configuration files
COPY --from=builder /app/.yarn ./.yarn
COPY --from=builder /app/.yarnrc.yml ./.yarnrc.yml
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js

ENV NODE_ENV=production

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["yarn", "start"]
