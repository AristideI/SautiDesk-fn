#!/bin/bash

# SautiDesk Frontend Docker Setup Script
# This script helps set up Docker and build the application

set -e

echo "🐳 SautiDesk Frontend Docker Setup"
echo "=================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed."
    echo ""
    echo "📦 Installing Docker..."
    
    # Detect OS and provide installation instructions
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "🍎 macOS detected"
        echo "Please install Docker Desktop for Mac:"
        echo "https://docs.docker.com/desktop/install/mac-install/"
        echo ""
        echo "After installation, run this script again."
        exit 1
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "🐧 Linux detected"
        echo "Installing Docker..."
        
        # Update package list
        sudo apt-get update
        
        # Install prerequisites
        sudo apt-get install -y \
            apt-transport-https \
            ca-certificates \
            curl \
            gnupg \
            lsb-release
        
        # Add Docker's official GPG key
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
        
        # Set up stable repository
        echo \
            "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
            $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
        
        # Install Docker Engine
        sudo apt-get update
        sudo apt-get install -y docker-ce docker-ce-cli containerd.io
        
        # Add user to docker group
        sudo usermod -aG docker $USER
        
        echo "✅ Docker installed successfully!"
        echo "🔄 Please log out and log back in for group changes to take effect."
        echo "Then run this script again."
        exit 0
    else
        echo "❓ Unsupported operating system: $OSTYPE"
        echo "Please install Docker manually: https://docs.docker.com/get-docker/"
        exit 1
    fi
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running."
    echo "Please start Docker Desktop or the Docker daemon."
    exit 1
fi

echo "✅ Docker is installed and running!"

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "⚠️  Docker Compose not found, but Docker Compose V2 should be included with Docker Desktop."
    echo "If you're using an older Docker version, please install Docker Compose separately."
fi

echo ""
echo "🔨 Building SautiDesk Frontend Docker image..."

# Build the production image
docker build -t sautidesk-frontend .

echo ""
echo "✅ Build completed successfully!"
echo ""
echo "🚀 To run the application:"
echo "   Production: docker-compose up"
echo "   Development: docker-compose --profile dev up"
echo ""
echo "📖 For more information, see DOCKER.md" 