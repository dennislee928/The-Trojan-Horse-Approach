FROM node:22-alpine

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json

RUN npm ci --workspace apps/web

COPY apps/web ./apps/web

WORKDIR /app/apps/web
RUN npm run build
RUN chown -R node:node /app

EXPOSE 3000
USER node

CMD ["npm", "run", "start"]
