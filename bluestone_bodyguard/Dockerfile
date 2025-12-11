# Build stage
FROM rust:1.83 AS builder

WORKDIR /app

# Copy manifests
COPY Cargo.toml Cargo.lock ./

# Copy source code
COPY src ./src

# Build for release
RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the binary from builder
COPY --from=builder /app/target/release/bluestone_bodyguard /app/bluestone_bodyguard

# Expose port
EXPOSE 3032

# Run the binary
CMD ["./bluestone_bodyguard"]
