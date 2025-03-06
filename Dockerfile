# Use Node.js as a builder image
FROM node:22-alpine AS build

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first for optimized caching
COPY package*.json ./

# Install dependencies, including devDependencies for the build process
RUN npm ci

# Copy the entire Angular project
COPY . .

# Build the Angular app
RUN npm run build --omit=dev

# Use Nginx as a lightweight web server for the Angular app
FROM nginx:alpine AS final

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the built Angular files to Nginx's serving directory
COPY --from=build /usr/src/app/dist/front-project/browser /usr/share/nginx/html

# Expose the default Nginx port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
