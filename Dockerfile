FROM node:17.4.0-slim

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production

COPY index.js ./

ENV WEBHOOK_PORT=8080
EXPOSE ${WEBHOOK_PORT}
ENV SIPGATE_WEBHOOK_SERVER_ADDRESS=""

CMD ["npm", "run", "start"]