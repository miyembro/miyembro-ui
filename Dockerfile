## Stage 1: Build the Angular app using Node.js
#FROM node:20-alpine AS build
#
#WORKDIR /app
#
## Copy workspace files
#COPY package.json package-lock.json ./
#RUN npm install
#
## Copy the rest of the workspace files
#COPY . .
#
## Build the Angular app (production build)
#RUN npx nx build miyembro --configuration=docker-swarm
#
## Stage 2: Serve with Nginx
#FROM docker.io/library/nginx:alpine
#
## Copy the built Angular files to Nginx HTML directory
#COPY --from=build /app/dist/miyembro/browser /usr/share/nginx/html
#
## Expose port 80
#EXPOSE 80
#
## Start Nginx in the foreground
#CMD ["nginx", "-g", "daemon off;"]
#
# Stage 1: Build the Angular app using Node.js
FROM node:20-alpine AS build

WORKDIR /app

# 1. Copy ONLY package files first (better layer caching)
COPY package.json package-lock.json ./

# 2. Install with production-only flags and clean cache immediately
RUN npm ci --omit=dev --prefer-offline --no-audit && \
    npm cache clean --force

# 3. Copy the rest only after dependencies are installed
COPY . .

# 4. Build with production settings
RUN npx nx build miyembro --configuration=docker-swarm --prod

# Stage 2: Serve with Nginx (optimized)
FROM nginx:alpine

# 5. Remove default nginx files to save space
RUN rm -rf /usr/share/nginx/html/*

# 6. Copy only the built files
COPY --from=build /app/dist/miyembro/browser /usr/share/nginx/html

# 7. Add optimized nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 8. Health check
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget --quiet --tries=1 --spider http://localhost:80 || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]