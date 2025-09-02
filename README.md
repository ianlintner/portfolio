# Portfolio

A modern, full-stack portfolio application built with Next.js, TypeScript, tRPC, and Prisma.

## 📚 Documentation

Comprehensive developer documentation is available at **[Portfolio Documentation](https://ianlintner.github.io/portfolio/)** or you can view it locally:

```bash
# Install dependencies
pnpm install

# Serve documentation locally
pnpm docs:serve
```

The documentation includes:

- **Getting Started**: Setup and installation guides
- **Development**: Architecture, API, and development workflows  
- **Deployment**: Docker, Kubernetes, and production deployment
- **Contributing**: Guidelines for contributing to the project

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/ianlintner/portfolio.git
cd portfolio

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Set up database
pnpm db:push
pnpm db:seed

# Start development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: tRPC, Prisma ORM, NextAuth.js
- **Database**: PostgreSQL
- **Storage**: Google Cloud Storage
- **Testing**: Jest, Playwright, Testing Library
- **Deployment**: Docker, Kubernetes
- **Documentation**: MkDocs with Material theme

## 📖 Learn More

- [📋 Project Overview](https://ianlintner.github.io/portfolio/getting-started/overview/) - Understand the architecture and design decisions
- [⚡ Installation Guide](https://ianlintner.github.io/portfolio/getting-started/installation/) - Step-by-step setup instructions
- [🏗️ Project Structure](https://ianlintner.github.io/portfolio/development/project-structure/) - Explore the codebase organization
- [🤝 Contributing](https://ianlintner.github.io/portfolio/contributing/guidelines/) - Guidelines for contributors

## 📄 License

This project is licensed under the MIT License.
