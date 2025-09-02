# Prerequisites

Before setting up the Portfolio application, ensure you have the following tools and services configured on your development machine.

## System Requirements

### Operating System
- **Linux**: Ubuntu 20.04+ or any modern Linux distribution
- **macOS**: macOS 11.0+ (Big Sur) or later
- **Windows**: Windows 10/11 with WSL2 enabled

### Hardware Requirements
- **Memory**: Minimum 8GB RAM (16GB recommended)
- **Storage**: At least 10GB free disk space
- **CPU**: Multi-core processor (development builds can be CPU-intensive)

## Required Software

### Node.js and Package Manager

!!! info "Package Manager Choice"
    This project uses **pnpm** as the package manager for better performance and disk efficiency. Do not use npm or yarn.

#### Node.js (Required)
Install Node.js 18.0 or later:

=== "Using Node Version Manager (Recommended)"
    ```bash
    # Install nvm (if not already installed)
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    
    # Restart your terminal or run:
    source ~/.bashrc
    
    # Install and use Node.js 18
    nvm install 18
    nvm use 18
    nvm alias default 18
    ```

=== "Using Official Installer"
    Download and install from [nodejs.org](https://nodejs.org/). Choose the LTS version (18.x or later).

=== "Using Package Manager"
    ```bash
    # Ubuntu/Debian
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    
    # macOS with Homebrew
    brew install node@18
    
    # Arch Linux
    sudo pacman -S nodejs npm
    ```

#### pnpm (Required)
Install pnpm globally:

```bash
npm install -g pnpm
```

Verify installation:
```bash
node --version  # Should be 18.0.0 or later
pnpm --version  # Should be 8.0.0 or later
```

### Database

#### PostgreSQL (Required)
You need PostgreSQL 13 or later for local development.

=== "Docker (Recommended)"
    Using Docker is the easiest way to run PostgreSQL:
    ```bash
    docker run --name portfolio-postgres \
      -e POSTGRES_PASSWORD=portfolio \
      -e POSTGRES_DB=portfolio \
      -e POSTGRES_USER=portfolio \
      -p 5432:5432 \
      -d postgres:15
    ```

=== "Local Installation"
    ```bash
    # Ubuntu/Debian
    sudo apt update
    sudo apt install postgresql postgresql-contrib
    
    # macOS with Homebrew
    brew install postgresql
    brew services start postgresql
    
    # Arch Linux
    sudo pacman -S postgresql
    sudo systemctl enable postgresql
    sudo systemctl start postgresql
    ```

### Development Tools

#### Git (Required)
```bash
# Ubuntu/Debian
sudo apt install git

# macOS (usually pre-installed, or use Homebrew)
brew install git

# Arch Linux
sudo pacman -S git
```

#### Code Editor (Recommended)
- **VS Code** with the following extensions:
  - TypeScript and JavaScript Language Features
  - Prisma
  - Tailwind CSS IntelliSense
  - ESLint
  - Prettier

#### Docker (Optional but Recommended)
For containerized development and deployment:

=== "Docker Desktop"
    Download from [docker.com](https://www.docker.com/products/docker-desktop/)

=== "Docker Engine (Linux)"
    ```bash
    # Ubuntu/Debian
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    ```

#### Kubernetes Tools (Optional)
For deployment and testing:

```bash
# kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Kind (for local Kubernetes testing)
go install sigs.k8s.io/kind@latest
```

## Cloud Services (Optional)

### Google Cloud Platform
For production deployment and file storage:

1. **Google Cloud Account**: Create at [console.cloud.google.com](https://console.cloud.google.com)
2. **Google Cloud SDK**: Install the `gcloud` CLI
3. **Service Account**: Create for application access to GCS

### Authentication Providers
For NextAuth.js authentication (choose one or more):

- **Google OAuth**: Google Cloud Console
- **GitHub OAuth**: GitHub Developer Settings
- **Discord OAuth**: Discord Developer Portal

## Environment Setup Validation

Create a test directory to verify your setup:

```bash
# Create test directory
mkdir portfolio-test && cd portfolio-test

# Initialize with pnpm
pnpm init

# Test Node.js
node --version

# Test PostgreSQL connection (adjust connection string as needed)
psql postgresql://portfolio:portfolio@localhost:5432/portfolio -c "SELECT version();"

# Test Docker (if installed)
docker --version
docker run hello-world

# Clean up
cd .. && rm -rf portfolio-test
```

## Common Issues and Solutions

### Node.js Version Issues
If you encounter version conflicts:
```bash
# Check current version
node --version

# If using nvm, switch to correct version
nvm use 18

# If not using nvm, uninstall and reinstall Node.js
```

### PostgreSQL Connection Issues
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list | grep postgresql  # macOS

# Check connection
psql -h localhost -p 5432 -U portfolio -d portfolio
```

### Permission Issues (Linux/macOS)
```bash
# Fix npm/pnpm global permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Docker Permission Issues (Linux)
```bash
# Add user to docker group
sudo usermod -aG docker $USER
# Log out and log back in
```

## Performance Optimization

### Development Performance
```bash
# Increase Node.js memory limit (if needed)
export NODE_OPTIONS="--max-old-space-size=4096"

# Enable pnpm store optimization
pnpm config set store-dir ~/.pnpm-store
```

### System Optimization
- **Memory**: Close unnecessary applications during development
- **Disk**: Use SSD for better performance
- **Network**: Stable internet connection for package downloads

## Next Steps

Once you have all prerequisites installed:

1. Continue to [Installation](installation.md) to clone and set up the project
2. Review [Configuration](configuration.md) to set up environment variables
3. Start developing with the [Development Guide](../development/project-structure.md)

!!! tip "Troubleshooting"
    If you encounter issues with any of these prerequisites, check the [Common Issues](#common-issues-and-solutions) section or create an issue on the [GitHub repository](https://github.com/ianlintner/portfolio/issues).