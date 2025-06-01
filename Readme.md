# 🏗️ Layout Service Documentation

## Overview

The **Layout Service** is a Node.js microservice designed for generating, saving, retrieving, and managing 2D floor plan layouts for a 3D architectural design platform. It accepts user-defined home parameters (such as number of rooms, room types, and dimensions) and returns a structured JSON layout schema suitable for frontend visualization and further processing.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Endpoints](#endpoints)
- [Data Models](#data-models)
- [Layout Generation Logic](#layout-generation-logic)
- [Environment Variables](#environment-variables)
- [Running the Service](#running-the-service)
- [Deployment](#deployment)
- [Example JSON Response](#example-json-response)

---

## Features

- Generate 2D layout schemas from input parameters
- Save, retrieve, and delete layouts for authenticated users
- Retrieve home parameters from a saved layout
- Token-based (JWT) authentication for protected routes
- Modular and easily extensible for integration into larger systems

---

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT (JSON Web Token)
- **Deployment:** Docker, Render
- **Other:** dotenv, cors, cookie-parser

---

## Project Structure

```
layout-service/
│
├── app.js                        # Main entry point
├── package.json                  # Project metadata and dependencies
├── Dockerfile                    # Docker container definition
├── .env                          # Environment variables
├── src/
│   ├── config/
│   │   └── index.js              # Database connection logic
│   ├── controllers/
│   │   └── layout.controllers.js # Route handler logic
│   ├── models/
│   │   └── layout.model.js       # Mongoose schema for layouts
│   ├── routes/
│   │   └── layout.routes.js      # API route definitions
│   ├── utils/
│   │   ├── layoutGenerator.js    # Core layout generation logic
│   │   ├── parameterGenerator.js # Infer input params from layout
│   │   └── token.js              # JWT verification middleware
```

---

## API Endpoints

### Authentication

All sensitive endpoints require a valid JWT token, which should be sent via the `Authorization` header as `Bearer <token>` or as a cookie named `token`.

### Endpoints

| Method | Route                        | Auth Required | Description                                 |
|--------|------------------------------|---------------|---------------------------------------------|
| GET    | `/api/v1/all-layout`         | ✅            | Fetch all layouts for the authenticated user|
| GET    | `/api/v1/layout/:id`         | ❌            | Fetch a specific layout by its ID           |
| GET    | `/api/v1/home-parameters/:id`| ✅            | Get home input parameters by layout ID      |
| POST   | `/api/v1/create-layout`      | ✅            | Generate a layout from input parameters     |
| POST   | `/api/v1/save-layout`        | ✅            | Save a generated layout to the database     |
| DELETE | `/api/v1/delete-layout/:id`  | ✅            | Delete a layout by its ID                   |

#### 1. `GET /api/v1/all-layout`

- **Protected:** Yes
- **Description:** Fetch all layouts created by the authenticated user.
- **Response:**
  ```json
  {
    "message": "All the layouts are",
    "layouts": [ ... ]
  }
  ```

#### 2. `GET /api/v1/layout/:id`

- **Protected:** No
- **Description:** Fetch a single layout by its unique ID.
- **Params:** `id` — Layout ID.
- **Response:**
  ```json
  {
    "message": "Layout found",
    "layout": { ... }
  }
  ```

#### 3. `GET /api/v1/home-parameters/:id`

- **Protected:** Yes
- **Description:** Retrieve the home parameter input used to generate a layout.
- **Params:** `id` — Layout ID.
- **Response:**
  ```json
  {
    "message": "Home parameters fetched successfully",
    "data": {
      "width": 40,
      "height": 30,
      "master_rooms": 2,
      "bathrooms": 2,
      "cars": 1,
      "bikes": 2
    }
  }
  ```

#### 4. `POST /api/v1/create-layout`

- **Protected:** Yes
- **Description:** Generate a layout from input parameters.
- **Request Body Example:**
  ```json
  {
    "width": 40,
    "height": 30,
    "master_rooms": 2,
    "bathrooms": 2,
    "cars": 1,
    "bikes": 2
  }
  ```
- **Response:**
  ```json
  {
    "layout": { ... },
    "message": "Layout created successfully"
  }
  ```

#### 5. `POST /api/v1/save-layout`

- **Protected:** Yes
- **Description:** Save a generated layout to the database.
- **Request Body Example:**
  ```json
  {
    "name": "My Dream Home",
    "description": "A spacious 2BHK with parking",
    "boundaries": { "width": 40, "height": 30 },
    "rooms": [ ... ]
  }
  ```
- **Response:**
  ```json
  {
    "message": "Layout saved successfully",
    "layout": { ... }
  }
  ```

#### 6. `DELETE /api/v1/delete-layout/:id`

- **Protected:** Yes
- **Description:** Delete a layout by its ID.
- **Response:**
  ```json
  {
    "message": "Layout deleted successfully"
  }
  ```

---

## Data Models

### Layout Model

Defined in [`src/models/layout.model.js`](src/models/layout.model.js):

- `name` (String, required): Name of the layout
- `description` (String): Optional description
- `boundaries` (Object, required): `{ width: Number, height: Number }`
- `rooms` (Array of Room): Each room has:
  - `name` (String)
  - `x1`, `y1`, `x2`, `y2` (Number): Coordinates
  - `area` (Number): Calculated area
- `user` (String, required): User ID (as string)
- `createdAt`, `updatedAt` (Date): Timestamps

---

## Layout Generation Logic

Implemented in [`src/utils/layoutGenerator.js`](src/utils/layoutGenerator.js):

- Accepts parameters: `width`, `height`, `master_rooms`, `bathrooms`, `cars`, `bikes`
- Allocates space for parking, corridor, guest rooms, master rooms, bathrooms, kitchen, and staircase
- Returns a JSON object with `boundaries` and an array of `rooms`, each with coordinates and area

---

## Environment Variables

Defined in `.env`:

- `PORT`: Port to run the service (default: 3002)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT authentication
- Email/SMTP settings (if needed for notifications)

---

## Running the Service

### Locally

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the server:
   ```sh
   node app.js
   ```
   Or for development with auto-reload:
   ```sh
   npm run dev
   ```

### With Docker

1. Build the Docker image:
   ```sh
   docker build -t layout-service .
   ```
2. Run the container:
   ```sh
   docker run -d -p 3002:3002 --env-file .env layout-service
   ```

Or use `docker-compose`:
```sh
docker-compose up --build
```

---

## Deployment

- **Render:** Connect your GitHub repo, set build command (`npm install`), start command (`node app.js`), and environment variables in the dashboard.
- **Other Platforms:** Any platform supporting Node.js and MongoDB.

---

## Example JSON Response

```json
{
  "rooms": [
    {
      "name": "Master Room 1",
      "x1": 18,
      "y1": 6,
      "x2": 40,
      "y2": 18,
      "area": 264
    },
    {
      "name": "Kitchen",
      "x1": 18,
      "y1": 18,
      "x2": 40,
      "y2": 24,
      "area": 132
    }
    // ...more rooms
  ],
  "boundaries": {
    "width": 40,
    "height": 30
  }
}
```

---

## Notes

- All protected endpoints require a valid JWT token.
- The layout generation logic is customizable; you can extend [`src/utils/layoutGenerator.js`](src/utils/layoutGenerator.js) for more complex rules.
- For any issues, check logs or ensure your `.env` is correctly configured.

---