FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy source code
COPY . .

# Build the Nuxt application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

COPY --from=base /app/.output ./.output
COPY --from=base /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=base /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/package.json ./

# Install only prisma CLI for migrations
RUN npm install -g prisma

EXPOSE 3000

# Run migrations then start the app
CMD ["sh", "-c", "prisma migrate deploy && node .output/server/index.mjs"]
