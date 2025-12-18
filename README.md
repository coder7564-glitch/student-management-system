## MySQL CRUD Dashboard (Dockerized)

![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000000)

### Overview

**MySQL CRUD Dashboard** is a small, production‑style demo that runs fully in **Docker**:

- **MySQL** for data storage  
- **Node.js + Express** backend  
- **HTML/CSS/JavaScript** single‑page UI for **Create, Read, Update, Delete** operations.

## Stack

- **Backend**: Node.js, Express, `mysql2`
- **Database**: MySQL 8 (Docker official image)
- **Frontend**: HTML5, CSS3, vanilla JS
- **Infra**: Docker, `docker-compose`

## Project Layout

- **`docker-compose.yml`** – defines `db` (MySQL) and `web` (Node/Express) services.
- **`db/init.sql`** – creates the `appdb` database and `items` table.
- **`web/server.js`** – REST API (`/api/items`) used by the UI.
- **`web/public/`** – `index.html`, `styles.css`, `script.js` for the dashboard.

## Quick Start

From the project root (`/home/naman/Downloads/db-docker`):

```bash
docker-compose up --build
```

- **Web UI**: `http://localhost:8080`  
- **MySQL**: `localhost:3306` (`appuser` / `apppassword`, DB `appdb`)

To stop:

```bash
docker-compose down
```

To stop and remove data:

```bash
docker-compose down -v
```

## Usage

- **Create** – enter **Name** and **Description**, click **Save**.  
- **Read** – items appear instantly in the **Items** table.  
- **Update** – click **Edit**, change fields, click **Update**.  
- **Delete** – click **Delete** and confirm.
