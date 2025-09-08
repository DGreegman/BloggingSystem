# -----------------------------
# 1. Dependencies stage
# -----------------------------
FROM node:18-alpine AS deps

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (only prod)
RUN npm ci --only=production


# -----------------------------
# 2. Production stage
# -----------------------------
FROM node:18-alpine AS production

ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Copy only necessary files
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY src ./src

# Expose Express default port
EXPOSE 3000

# Start the app
CMD ["node", "src/index.js"]
