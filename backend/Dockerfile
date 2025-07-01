FROM node:20 AS builder

WORKDIR /src 

COPY package*.json ./

RUN npm install 

COPY . .

FROM node:20-alpine AS stack

WORKDIR /app

COPY --from=builder /src ./

EXPOSE 5000

CMD [ "node","server.js" ]

