# syntax = docker/dockerfile:1

# Use the official Node.js LTS version as the base image
ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-slim as base

# Set working directory
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Install build dependencies in a separate stage
FROM base as build

# Install packages needed to build native modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
        build-essential \
        pkg-config \
        python-is-python3 && \
    rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json to leverage Docker cache
COPY package.json package-lock.json ./

# Set NODE_ENV to development to install devDependencies
ENV NODE_ENV=development

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Prune devDependencies since they're not needed in the final image
RUN npm prune --production

# Final stage: create the production image
FROM base

# Copy production node_modules and built application from the build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.output ./.output

# Expose the port the app runs on
EXPOSE 3000

# Start the server using Node.js
CMD ["node", ".output/server/index.mjs"]

