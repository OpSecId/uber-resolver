# Build static assets, then serve with nginx and /engine/* reverse proxy.
FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/templates/default.conf.template /etc/nginx/templates/default.conf.template

# Upstream resolver hosts (docker-compose service names by default).
ENV ENGINE_RS_HOST=resolver-didwebvh-rs \
    ENGINE_RS_PORT=8081 \
    ENGINE_PY_HOST=resolver-didwebvh-py \
    ENGINE_PY_PORT=8082 \
    ENGINE_TS_HOST=resolver-didwebvh-ts \
    ENGINE_TS_PORT=8083

EXPOSE 80
