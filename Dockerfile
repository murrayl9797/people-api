FROM node:12-alpine3.12

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4444

CMD ["node", "server/local.js"]