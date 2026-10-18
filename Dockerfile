# ---------- STAGE 1: Build the React app ----------
FROM node:22-alpine AS builder

# Create app directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install exact versions from package-lock.json
RUN npm ci

# Copy the rest of the source
COPY . .

# Build static site (the prebuild step regenerates public/posts/index.json)
RUN npm run build


# ---------- STAGE 2: Serve with Nginx ----------
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# SPA routing + caching rules
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
