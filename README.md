# Student Management System (Dockerized)

![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000000)

## Overview

A **full-stack Student Management System** built with modern web technologies and fully containerized with Docker. This production-ready application features role-based authentication, student management, course enrollment tracking, leave management, and academic performance monitoring.

### Key Features

#### 🔐 **Authentication & Authorization**
- Session-based authentication with bcrypt password hashing
- Role-based access control (Admin & Student portals)
- Secure login/logout functionality
- Protected routes with middleware

#### 👨‍💼 **Admin Portal**
- **Student Management**: Complete CRUD operations for student records
- **Course Management**: Create, update, and manage courses
- **Enrollment Management**: Link students with courses
- **Leave Management**: Approve or reject student leave applications
- **Midterm Marks**: Record and manage student academic performance
- **Real-time Statistics**: Dashboard with student count, course metrics, and analytics

#### 👨‍🎓 **Student Portal**
- **Personal Dashboard**: View personal information and academic stats
- **Apply for Leave**: Submit leave applications with date ranges and reasons
- **View Marks**: Check midterm marks and academic performance
- **Course Enrollment**: View enrolled courses

## Tech Stack

- **Backend**: Node.js, Express.js, `mysql2`, `express-session`, `bcryptjs`
- **Database**: MySQL 8.0 (Official Docker image)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Infrastructure**: Docker, Docker Compose
- **Security**: Session management, password hashing, SQL injection protection

## Project Structure

```
.
├── docker-compose.yml              # Orchestrates MySQL and Node.js services
├── .env.example                    # Environment variable template
├── db/
│   └── init.sql                    # Database schema initialization
└── web/
    ├── Dockerfile                  # Node.js application container
    ├── package.json                # Node.js dependencies
    ├── server.js                   # Express REST API server
    └── public/                     # Frontend static files
        ├── index.html              # Landing page
        ├── admin-login.html        # Admin authentication
        ├── student-login.html      # Student authentication
        ├── student-management.html # Admin dashboard
        ├── student-dashboard.html  # Student dashboard
        ├── apply-leave.html        # Leave application form
        ├── leave-management.html   # Admin leave approval
        └── midterm-marks.html      # Academic performance tracking
```

## Database Schema

The system uses a normalized MySQL database with the following tables:

- **`students`** – Student records (name, email, DOB)
- **`courses`** – Course catalog (code, title, description)
- **`enrollments`** – Student-course relationships
- **`users`** – Authentication (email, password hash, role, linked student)

Additional tables may be created at runtime for leaves and marks management.

## Quick Start

### Prerequisites

- Docker (version 20.10+)
- Docker Compose (version 1.29+)

### 1. Clone and Configure

```bash
# Copy environment configuration
cp .env.example .env

# (Optional) Edit .env to customize credentials
nano .env
```

### 2. Launch the Application

```bash
# Build and start all services
docker-compose up --build
```

The application will:
- Start MySQL database on `localhost:3306`
- Initialize database schema from `db/init.sql`
- Start Node.js web server on `localhost:8080`
- Create default admin account from environment variables

### 3. Access the Application

- **Web Application**: http://localhost:8080
- **MySQL Database**: `localhost:3306`
  - User: `appuser` (default)
  - Password: `apppassword` (default)
  - Database: `appdb`

### 4. Login Credentials

**Default Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

**Student accounts** must be created by the admin first, then login credentials can be assigned.

### 5. Stop the Application

```bash
# Stop services (preserves data)
docker-compose down

# Stop and remove all data volumes
docker-compose down -v
```

## API Endpoints

### Authentication
- `POST /api/login` – User login (admin/student)
- `POST /api/logout` – User logout
- `GET /api/check-auth` – Check authentication status

### Students (Admin only)
- `GET /api/students` – List all students
- `POST /api/students` – Create new student
- `PUT /api/students/:id` – Update student
- `DELETE /api/students/:id` – Delete student

### Courses (Admin only)
- `GET /api/courses` – List all courses
- `POST /api/courses` – Create new course
- `PUT /api/courses/:id` – Update course
- `DELETE /api/courses/:id` – Delete course

### Enrollments (Admin only)
- `GET /api/enrollments` – List all enrollments
- `POST /api/enrollments` – Enroll student in course
- `DELETE /api/enrollments/:id` – Remove enrollment

### Leave Management
- `POST /api/leaves` – Apply for leave (Student)
- `GET /api/leaves` – View leaves (Admin: all, Student: own)
- `PUT /api/leaves/:id` – Approve/reject leave (Admin)

### Marks Management
- `GET /api/marks` – View marks (Admin: all, Student: own)
- `POST /api/marks` – Add marks (Admin)
- `PUT /api/marks/:id` – Update marks (Admin)

## Environment Variables

Configure these in `.env` file:

```bash
# Database Configuration
DB_ROOT_PASSWORD=rootpassword
DB_NAME=appdb
DB_USER=appuser
DB_PASSWORD=apppassword
DB_PORT=3306

# Application Configuration
NODE_ENV=production
WEB_PORT=8080
SESSION_SECRET=your_secure_random_secret_here

# Admin Account (created on first launch)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

## Development

### Run in Development Mode

```bash
# Set development environment
NODE_ENV=development

# Start with hot reload
cd web
npm install
npm start
```

### Database Management

```bash
# Access MySQL console
docker exec -it attendance-db mysql -u appuser -p

# View logs
docker-compose logs -f db
docker-compose logs -f web

# Backup database
docker exec attendance-db mysqldump -u appuser -papppassword appdb > backup.sql

# Restore database
docker exec -i attendance-db mysql -u appuser -papppassword appdb < backup.sql
```

## Security Features

- ✅ **Password Hashing**: bcrypt with salt rounds
- ✅ **SQL Injection Protection**: Parameterized queries
- ✅ **Session Management**: Secure HTTP-only cookies
- ✅ **Role-Based Access Control**: Middleware-protected routes
- ✅ **Environment Variables**: Sensitive data not hardcoded
- ✅ **Health Checks**: Docker container monitoring

## Production Deployment

Before deploying to production:

1. **Change all default passwords** in `.env`
2. **Use a strong SESSION_SECRET** (minimum 32 random characters)
3. **Enable HTTPS** with reverse proxy (nginx/traefik)
4. **Configure database backups** (automated daily backups)
5. **Set up monitoring** (logs, health checks, alerts)
6. **Review and harden** Docker security settings
7. **Implement rate limiting** for API endpoints
8. **Add CORS configuration** if frontend is on different domain

## Troubleshooting

### Database Connection Issues
```bash
# Check if database is healthy
docker-compose ps

# View database logs
docker-compose logs db

# Restart services
docker-compose restart
```

### Port Already in Use
```bash
# Change ports in .env or docker-compose.yml
WEB_PORT=8081
DB_PORT=3307
```

### Reset Everything
```bash
# Nuclear option: remove all containers, volumes, and images
docker-compose down -v
docker system prune -a
docker-compose up --build
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available for educational purposes.

## Acknowledgments

- Built with modern web standards and best practices
- Containerized for easy deployment and scalability
- Designed for educational institutions and student management needs

---

**Developed for efficient student management and academic tracking** 🎓
