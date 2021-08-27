FROM node:12-alpine3.12

WORKDIR /app

RUN pwd

COPY package*.json ./

RUN npm install

COPY . .


EXPOSE 4444

# CMD ["pwd"]
RUN ["/usr/local/bin/node", "/app/database/init.js"]

CMD ["/usr/local/bin/node", "/app/server/local.js"]