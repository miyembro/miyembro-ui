# Stage 1: Build the Angular app using Node.js
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npx nx build miyembro --configuration=docker-swarm

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy built Angular files
COPY --from=build /app/dist/miyembro/browser /usr/share/nginx/html

# Create and use a minimal Nginx config for Angular
RUN echo "server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files \$uri \$uri/ /index.html; \
    } \
    location /api { \
        proxy_pass ${API_URL}; \
        proxy_set_header Host \$host; \
        proxy_set_header X-Real-IP \$remote_addr; \
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for; \
    } \
}" > /etc/nginx/conf.d/angular.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]