FROM node:17.4.0-slim

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production

COPY index.js ./

EXPOSE ${WEBHOOK_PORT}

CMD ["npm", "run", "start"]
