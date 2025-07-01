# 1️⃣ Build React app
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . ./

RUN npm run build

# 2️⃣ Serve with NGINX
FROM nginx:alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy React build output to NGINX
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
