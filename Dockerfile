# syntax=docker/dockerfile:1

# ---------- Build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --legacy-peer-deps || npm install --legacy-peer-deps; else npm install --legacy-peer-deps; fi

COPY . .

# API is served from the same domain through Caddy (https://sebna.et/api/sebna)
ARG VITE_API_URI=/api/sebna
ENV VITE_API_URI=$VITE_API_URI
RUN npm run build

# ---------- Runtime stage: Caddy serves the SPA + HTTPS + reverse proxy ----------
FROM caddy:2.8-alpine
COPY --from=build /app/dist /srv
EXPOSE 80 443 443/udp
