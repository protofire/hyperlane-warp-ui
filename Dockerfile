FROM node:20-alpine AS builder

WORKDIR /app
RUN corepack enable
COPY . .
RUN yarn install --immutable
RUN yarn build

FROM node:20-alpine AS runner

WORKDIR /app

# Copy Yarn configuration files
# COPY --from=builder /app/.yarn ./.yarn
# COPY --from=builder /app/.yarnrc.yml ./.yarnrc.yml
# COPY --from=builder /app/yarn.lock ./yarn.lock
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/next.config.js ./next.config.js

# Copy missing files from node_modules to standalone
# cp node_modules/async-function/require.mjs .next/standalone/node_modules/async-function/
# cp node_modules/async-function/index.mjs .next/standalone/node_modules/async-function/
# cp node_modules/async-function/index.d.ts .next/standalone/node_modules/async-function/ 2>/dev/null || true
# cp node_modules/async-function/index.d.mts .next/standalone/node_modules/async-function/ 2>/dev/null || true

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/async-function/ ./node_modules/async-function/
COPY --from=builder /app/node_modules/generator-function/ ./node_modules/generator-function/
COPY --from=builder /app/node_modules/async-generator-function/ ./node_modules/async-generator-function/


ENV NODE_ENV=production

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT [ "node", "server.js" ]
