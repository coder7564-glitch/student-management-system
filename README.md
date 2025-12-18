## MySQL CRUD Dashboard (Dockerized)

![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000000)

### Overview

This project is a **full-stack CRUD dashboard** running entirely in **Docker**:

- **MySQL container** for persistent storage.
- **Web app container** (Node.js + Express) serving a modern **HTML/CSS/JS** UI.
- Users can **Create, Read, Update, Delete** items via a simple browser-based GUI.

## Architecture and Project Plan

- **Dockerized services**
  - **`db`**: MySQL 8 instance, initialized with an `items` table via `db/init.sql`.
  - **`web`**: Node.js/Express backend with static frontend assets, connected to `db` over the Docker network.

- **Data model**
  - **Table**: `items`
  - **Columns**: `id`, `name`, `description`, `created_at`.

- **API design**
  - **GET** `/api/items` – list all items.
  - **POST** `/api/items` – create a new item.
  - **PUT** `/api/items/:id` – update existing item.
  - **DELETE** `/api/items/:id` – delete by id.

- **Planned enhancements (roadmap)**
  - **Authentication** (simple login) to protect the dashboard.
  - **Search and filters** on the items table.
  - **Pagination** for large datasets.
  - **Form validation** and richer error messages.
  - **Dockerized tests** (backend and basic UI smoke tests).

## Tech Stack

- **Backend**: Node.js, Express, `mysql2`
- **Database**: MySQL 8 (Docker official image)
- **Frontend**: HTML5, CSS3, vanilla JavaScript
- **Containerization**: Docker, `docker-compose`

## Project Structure

- **`docker-compose.yml`** – defines `db` and `web` services, networking, and volumes.
- **`db/init.sql`** – creates the `appdb` database and `items` table.
- **`web/Dockerfile`** – build instructions for the web container.
- **`web/server.js`** – Express server and REST API for CRUD operations.
- **`web/public/index.html`** – MySQL CRUD dashboard UI.
- **`web/public/styles.css`** – modern dark-theme styling.
- **`web/public/script.js`** – frontend logic for calling the REST API (CRUD).

## Getting Started

### Prerequisites

- **Docker** and **Docker Compose** installed on your machine.

### Run the application

From the project root (`/home/naman/Downloads/db-docker`):

```bash
docker-compose up --build
```

- **Web UI**: open `http://localhost:8080` in your browser.
- **MySQL** (optional external access):
  - **Host**: `localhost`
  - **Port**: `3306`
  - **User**: `appuser`
  - **Password**: `apppassword`
  - **Database**: `appdb`

### Stopping the containers

In the same directory:

```bash
docker-compose down
```

To also remove the MySQL data volume:

```bash
docker-compose down -v
```

## Using the GUI

- **Create**: fill in **Name** and **Description**, click **Save**.
- **Read**: all items appear in the **Items** table.
- **Update**: click **Edit** on a row, modify values, click **Update**.
- **Delete**: click **Delete** on a row and confirm.



