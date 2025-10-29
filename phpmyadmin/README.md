# phpMyAdmin Docker Setup

This directory contains a Docker setup for phpMyAdmin with MySQL database.

## Files

- `Dockerfile` - Custom phpMyAdmin Docker image
- `docker-compose.yml` - Docker Compose configuration with MySQL and phpMyAdmin

## Quick Start

### Using Docker Compose (Recommended)

1. Start the services:
```bash
docker-compose up -d
```

2. Access phpMyAdmin at: http://localhost:8080

3. Login credentials:
   - Server: `db`
   - Username: `root`
   - Password: `rootpassword`
   
   Or use the non-root user:
   - Username: `user`
   - Password: `password`

4. Stop the services:
```bash
docker-compose down
```

### Using Dockerfile Only

1. Build the image:
```bash
docker build -t my-phpmyadmin .
```

2. Run the container (requires existing MySQL server):
```bash
docker run -d \
  --name phpmyadmin \
  -e PMA_HOST=your_mysql_host \
  -e PMA_PORT=3306 \
  -p 8080:80 \
  my-phpmyadmin
```

## Configuration

### Environment Variables

- `PMA_HOST` - MySQL host address (default: `db`)
- `PMA_PORT` - MySQL port (default: `3306`)
- `PMA_ARBITRARY` - Allow connection to arbitrary servers (default: `1`)
- `UPLOAD_LIMIT` - Maximum upload file size (default: `300M`)

### Customizing MySQL Credentials

Edit the `docker-compose.yml` file and update the following environment variables:

```yaml
MYSQL_ROOT_PASSWORD: your_root_password
MYSQL_DATABASE: your_database_name
MYSQL_USER: your_username
MYSQL_PASSWORD: your_password
```

## Data Persistence

MySQL data is persisted in a Docker volume named `db_data`. To remove all data:

```bash
docker-compose down -v
```

## Troubleshooting

- If port 8080 is already in use, change it in `docker-compose.yml`:
  ```yaml
  ports:
    - "8081:80"  # Use port 8081 instead
  ```

- To view logs:
  ```bash
  docker-compose logs -f phpmyadmin
  docker-compose logs -f db
  ```
