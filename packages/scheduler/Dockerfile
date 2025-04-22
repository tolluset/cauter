FROM oven/bun:1-slim

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY packages/scheduler/package.json ./packages/scheduler/
COPY packages/shared/package.json ./packages/shared/

# Install pnpm and dependencies
RUN bun install -g pnpm && pnpm install --frozen-lockfile

# Copy source code
COPY packages/scheduler ./packages/scheduler
COPY packages/shared ./packages/shared

# Set environment variables
ENV NODE_ENV=production

# Expose port if needed
# EXPOSE 3000

# Start the application
CMD ["bun", "run", "./packages/scheduler/index.ts"] 