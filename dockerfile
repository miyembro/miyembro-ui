# Stage 1: Build the Angular app using Node.js
FROM node:20 AS build

WORKDIR /app

# Copy workspace files
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the workspace files
COPY . .

# Build the Angular app (production build)
RUN npx nx build miyembro --configuration=production

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy the built Angular files to Nginx HTML directory
COPY --from=build /app/dist/miyembro/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]



# WORKING ANGULAR APP DOCKER SWARM
# Stage 1: Build the Angular app using Node.js
# FROM node:20 AS build

# WORKDIR /app

# # Copy workspace files
# COPY package.json package-lock.json ./
# RUN npm install

# # Copy Nx workspace files
# COPY . .

# # Build the Angular app (production build)
# RUN npx nx build miyembro --configuration=local

# # Stage 2: Serve with Nginx
# FROM nginx:alpine

# # Copy the built Angular files to Nginx HTML directory
# COPY --from=build /app/dist/miyembro/browser /usr/share/nginx/html

# # Expose port 80
# EXPOSE 80

# # Start Nginx in the foreground
# CMD ["nginx", "-g", "daemon off;"]
