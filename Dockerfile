# Stage 1: Build the Angular app
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npx nx build miyembro --configuration=docker-swarm

# Stage 2: Serve with Nginx
FROM docker.io/library/nginx:alpine

# Remove all default configurations
RUN rm -rf /etc/nginx/conf.d/*

# Copy built Angular files
COPY --from=build /app/dist/miyembro/browser /usr/share/nginx/html

# Copy our custom Nginx configuration
COPY nginx-default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]