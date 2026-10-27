# Multi-stage production build for TaskVille Virtual Office
# Stage 1: Build production bundle with Node.js
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code and assets
COPY . .

# Build production distribution
RUN npm run build

# Stage 2: Serve with lightweight high-performance Nginx
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
