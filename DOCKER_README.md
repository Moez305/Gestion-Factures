# Docker Setup for Client Billing Application

This project has been dockerized for easy deployment and development. The application consists of three main components:

- **Frontend**: React application (port 3000)
- **Backend**: Node.js/Express API (port 5000)
- **Database**: MySQL 8.0 (port 3306)

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (usually included with Docker Desktop)

## Quick Start

### Option 1: Using Batch Files (Windows)

1. **Start the application:**

   ```bash
   docker-start.bat
   ```

2. **Stop the application:**
   ```bash
   docker-stop.bat
   ```

### Option 2: Using Docker Compose Commands

1. **Build and start all services:**

   ```bash
   docker-compose up --build -d
   ```

2. **View logs:**

   ```bash
   docker-compose logs -f
   ```

3. **Stop all services:**

   ```bash
   docker-compose down
   ```

4. **Stop and remove volumes (database data):**
   ```bash
   docker-compose down -v
   ```

## Accessing the Application

Once all services are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Database**: localhost:3306

## Environment Configuration

### Database Configuration

The database is automatically configured with these default values:

- **Database Name**: `client_billing_db`
- **Username**: `billing_user`
- **Password**: `billing_password`
- **Root Password**: `rootpassword`

### Custom Environment Variables

To customize the configuration, create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=db
DB_PORT=3306
DB_NAME=client_billing_db
DB_USER=billing_user
DB_PASSWORD=billing_password

# Server Configuration
NODE_ENV=production
PORT=5000

# Client Configuration
REACT_APP_API_URL=http://localhost:5000
```

## Docker Services

### 1. Frontend (client)

- **Image**: Built from `client/Dockerfile`
- **Port**: 3000
- **Dependencies**: server

### 2. Backend (server)

- **Image**: Built from `server/Dockerfile`
- **Port**: 5000
- **Dependencies**: db

### 3. Database (db)

- **Image**: mysql:8.0
- **Port**: 3306
- **Volume**: mysql_data (persistent storage)

## Development Workflow

### Making Changes

1. Make your code changes
2. Rebuild the affected service:
   ```bash
   docker-compose up --build -d [service_name]
   ```

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f server
docker-compose logs -f client
docker-compose logs -f db
```

### Database Access

```bash
# Connect to MySQL container
docker-compose exec db mysql -u billing_user -p client_billing_db
```

## Troubleshooting

### Common Issues

1. **Port already in use:**

   - Stop any existing services using ports 3000, 5000, or 3306
   - Or modify the ports in `docker-compose.yml`

2. **Database connection issues:**

   - Wait for the database to fully start (may take 30-60 seconds)
   - Check logs: `docker-compose logs db`

3. **Build failures:**
   - Clear Docker cache: `docker system prune -a`
   - Rebuild: `docker-compose up --build --force-recreate`

### Useful Commands

```bash
# Remove all containers and images
docker-compose down --rmi all --volumes --remove-orphans

# Clean up Docker system
docker system prune -a

# View running containers
docker ps

# Access container shell
docker-compose exec server sh
docker-compose exec client sh
```

## Production Deployment

For production deployment, consider:

1. **Security**: Change default passwords
2. **SSL**: Add reverse proxy with SSL termination
3. **Monitoring**: Add health checks and monitoring
4. **Backup**: Implement database backup strategy
5. **Scaling**: Use Docker Swarm or Kubernetes for scaling

## File Structure

```
prjyassir/
├── docker-compose.yml          # Main orchestration file
├── docker-start.bat           # Windows start script
├── docker-stop.bat            # Windows stop script
├── client/
│   ├── Dockerfile             # Frontend container
│   └── .dockerignore          # Frontend ignore rules
├── server/
│   ├── Dockerfile             # Backend container
│   └── .dockerignore          # Backend ignore rules
└── .dockerignore              # Root ignore rules
```
