FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

ARG OUTPUT_DIR=build
RUN npm run build

FROM nginx:1.27-alpine
RUN apk add --no-cache curl
COPY nginx.conf /etc/nginx/conf.d/default.conf
ARG OUTPUT_DIR=build
COPY --from=builder /app/${OUTPUT_DIR} /usr/share/nginx/html
HEALTHCHECK --interval=30s --timeout=3s CMD curl -fsS http://localhost/ || exit 1