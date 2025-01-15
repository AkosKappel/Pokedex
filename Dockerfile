# Build stage
FROM node:18-alpine AS build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Production stage
FROM nginx:1.19.0-alpine AS production-stage

COPY --from=build-stage /app/dist /app/pokevue

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
