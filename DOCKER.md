# 🐳 Docker Setup for SautiDesk Frontend

This document provides instructions for running the SautiDesk Frontend application using Docker.

## 📋 Prerequisites

- Docker installed on your system
- Docker Compose (usually comes with Docker Desktop)

## 🚀 Quick Start

### Production Build

1. **Build and run the production container:**

   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - Open your browser and navigate to `http://localhost:3000`
   - Health check endpoint: `http://localhost:3000/health`

### Development Build

1. **Run in development mode with hot reloading:**

   ```bash
   docker-compose --profile dev up --build
   ```

2. **Access the development server:**
   - Open your browser and navigate to `http://localhost:3001`

## 🛠 Manual Docker Commands

### Production Build

```bash
# Build the production image
docker build -t sautidesk-frontend .

# Run the container
docker run -p 3000:3000 sautidesk-frontend
```

### Development Build

```bash
# Build the development image
docker build -f Dockerfile.dev -t sautidesk-frontend:dev .

# Run the development container
docker run -p 3000:3000 -v $(pwd):/app sautidesk-frontend:dev
```

## 📁 Docker Files Overview

### `Dockerfile`

- **Multi-stage build** for optimized production image
- **Stage 1 (deps)**: Install production dependencies
- **Stage 2 (builder)**: Build the application
- **Stage 3 (runner)**: Create minimal production image
- **Security**: Runs as non-root user
- **Size**: Optimized for production deployment

### `Dockerfile.dev`

- **Single-stage build** for development
- **Hot reloading**: Volume mounting for live code changes
- **Full dependencies**: Includes dev dependencies
- **Development server**: Uses `npm run dev`

### `docker-compose.yml`

- **Production service**: `sautidesk-app` on port 3000
- **Development service**: `sautidesk-dev` on port 3001 (profile: dev)
- **Health checks**: Automatic health monitoring
- **Environment variables**: Configurable settings

### `.dockerignore`

- **Optimized builds**: Excludes unnecessary files
- **Security**: Prevents sensitive files from being copied
- **Performance**: Reduces build context size

## 🔧 Environment Variables

The following environment variables can be configured:

| Variable   | Default      | Description         |
| ---------- | ------------ | ------------------- |
| `NODE_ENV` | `production` | Node.js environment |
| `PORT`     | `3000`       | Application port    |

### Example with custom environment:

```bash
# Using docker-compose
docker-compose up -e NODE_ENV=development -e PORT=8080

# Using docker run
docker run -p 8080:8080 -e NODE_ENV=development -e PORT=8080 sautidesk-frontend
```

## 🏥 Health Checks

The application includes a health check endpoint at `/health` that returns:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "SautiDesk Frontend"
}
```

Docker Compose automatically monitors this endpoint every 30 seconds.

## 📊 Monitoring

### Container Status

```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f sautidesk-app

# Check resource usage
docker stats
```

### Health Check Status

```bash
# Manual health check
curl http://localhost:3000/health

# Check container health
docker inspect --format='{{.State.Health.Status}}' <container_id>
```

## 🔒 Security Features

- **Non-root user**: Application runs as `nextjs` user (UID: 1001)
- **Minimal base image**: Uses Alpine Linux for smaller attack surface
- **Multi-stage builds**: Reduces final image size
- **No sensitive data**: Environment variables for configuration

## 🚀 Deployment

### Production Deployment

1. **Build the image:**

   ```bash
   docker build -t sautidesk-frontend:latest .
   ```

2. **Push to registry (optional):**

   ```bash
   docker tag sautidesk-frontend:latest your-registry/sautidesk-frontend:latest
   docker push your-registry/sautidesk-frontend:latest
   ```

3. **Deploy:**
   ```bash
   docker run -d -p 3000:3000 --name sautidesk-frontend sautidesk-frontend:latest
   ```

### Kubernetes Deployment

Create a `deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sautidesk-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: sautidesk-frontend
  template:
    metadata:
      labels:
        app: sautidesk-frontend
    spec:
      containers:
        - name: sautidesk-frontend
          image: sautidesk-frontend:latest
          ports:
            - containerPort: 3000
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use:**

   ```bash
   # Check what's using the port
   lsof -i :3000

   # Use a different port
   docker run -p 3001:3000 sautidesk-frontend
   ```

2. **Build fails:**

   ```bash
   # Clear Docker cache
   docker system prune -a

   # Rebuild without cache
   docker build --no-cache -t sautidesk-frontend .
   ```

3. **Permission issues:**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

### Debug Mode

```bash
# Run with interactive shell
docker run -it --rm sautidesk-frontend /bin/sh

# Check container logs
docker logs <container_id>

# Inspect container
docker inspect <container_id>
```

## 📝 Best Practices

1. **Always use specific image tags** in production
2. **Regularly update base images** for security patches
3. **Monitor resource usage** and set appropriate limits
4. **Use health checks** for reliable deployments
5. **Implement proper logging** for debugging
6. **Scan images** for vulnerabilities regularly

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: docker build -t sautidesk-frontend .
      - name: Push to registry
        run: |
          docker tag sautidesk-frontend:latest ${{ secrets.REGISTRY }}/sautidesk-frontend:latest
          docker push ${{ secrets.REGISTRY }}/sautidesk-frontend:latest
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [React Router v7 Documentation](https://reactrouter.com/)
- [Alpine Linux](https://alpinelinux.org/)

---

For more information about the SautiDesk project, see the main [README.md](./README.md).
