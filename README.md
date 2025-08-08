# Client Billing Application

A simple client billing management system built with React, Node.js, and MySQL.

## 🚀 Quick Start (For Non-Developers)

**Super Simple Guide: [QUICK_START.md](QUICK_START.md)**

**Detailed Guide: [STARTUP_GUIDE.md](STARTUP_GUIDE.md)**

These guides will walk you through installing Docker and starting the application with just a few clicks.

## 🛠️ For Developers

### Prerequisites

- Docker Desktop
- Git

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd prjyassir

# Start the application
docker-compose up --build -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

### Development

```bash
# View logs
docker-compose logs -f

# Stop the application
docker-compose down

# Rebuild a specific service
docker-compose up --build -d [service_name]
```

## 📁 Project Structure

```
prjyassir/
├── client/                 # React frontend
├── server/                 # Node.js backend
├── docker-compose.yml      # Docker orchestration
├── docker-start.bat        # Easy start script
├── docker-stop.bat         # Easy stop script
├── STARTUP_GUIDE.md        # Non-developer guide
└── DOCKER_README.md        # Detailed Docker documentation
```

## 🔧 Features

- Client management
- Bill creation and management
- PDF invoice generation
- Search functionality
- Responsive design

## 📝 License

This project is for educational purposes.
