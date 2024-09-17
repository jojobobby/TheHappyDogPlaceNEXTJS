# Use Node.js 20 Alpine as the base image
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN yarn run build

# Expose the port the app runs on
EXPOSE 3000

# Set host to 0.0.0.0 to allow external connections
ENV HOST=0.0.0.0

# Start the application
CMD ["yarn", "run", "start", "--", "-H", "0.0.0.0:3000"]
