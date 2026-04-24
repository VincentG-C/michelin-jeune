FROM node:20-alpine AS base

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .

ARG MAPBOX_PUBLIC_TOKEN
ENV MAPBOX_PUBLIC_TOKEN=$MAPBOX_PUBLIC_TOKEN

RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app

COPY --from=base /app/.output ./.output
COPY --from=base /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=base /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=base /app/node_modules/prisma ./node_modules/prisma
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/prisma.config.ts ./prisma.config.ts
COPY --from=base /app/package.json ./

RUN npm install -g prisma

EXPOSE 3000

CMD ["sh", "-c", "prisma db push --accept-data-loss && node .output/server/index.mjs"]
