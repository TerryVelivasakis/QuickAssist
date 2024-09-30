# Step 1: Build the React app
FROM node:18-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the rest of the app’s source code into the container
COPY . .

# Build the React app for production
RUN npm run build

# Step 2: Serve the app using Nginx
FROM nginx:alpine

# Copy the build files from the previous stage to the Nginx container
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: Copy a custom Nginx configuration file (if you have one)
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 to serve the application
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
