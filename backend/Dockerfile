# ----------------------------------------
# Stage 1: Build Stage
# ----------------------------------------
FROM node:20-alpine AS development

WORKDIR /app

# Install dependencies first to leverage Docker layer caching
COPY package*.json ./
RUN npm install

# Copy all application files
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# ----------------------------------------
# Stage 2: Production/Runtime Stage
# ----------------------------------------
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy built artifacts and node_modules from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json .

# Set default environment variable for port
ENV PORT=8080

# Expose the application port
EXPOSE 8080

# Start the application
CMD [ "npm", "start" ]