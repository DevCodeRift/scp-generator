# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm for faster installs (optional, can use npm)
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml* package-lock.json* ./

# Install dependencies
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else npm install; fi

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Install FFmpeg for video processing + fonts for drawtext filter overlays
RUN apk add --no-cache ffmpeg ttf-dejavu fontconfig

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 sveltekit

# Create temp directory for video processing
RUN mkdir -p /tmp/video-processing && \
    chown sveltekit:nodejs /tmp/video-processing

# Copy built application
COPY --from=builder --chown=sveltekit:nodejs /app/build ./build
COPY --from=builder --chown=sveltekit:nodejs /app/package.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Switch to non-root user
USER sveltekit

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
ENV BODY_SIZE_LIMIT=Infinity
ENV VIDEO_TEMP_DIR=/tmp/video-processing

# Start the application
CMD ["node", "build"]
