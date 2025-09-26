# ----------------------------------------
# Stage 1: Base/Development Stage
# ----------------------------------------
FROM node:20-alpine AS development

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app for development
COPY . .

# Set environment for the Vite dev server
ENV HOST=0.0.0.0
ENV PORT=5173

EXPOSE 5173

# Command to start the Vite development server
CMD ["npm", "run", "dev", "--", "--host"]