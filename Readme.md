# 🏗️ Layout Service - 3D Architectural Design Platform

The **Layout Service** is a core microservice responsible for generating, retrieving, saving, and managing 2D floor plan layouts based on user-defined home parameters such as number of rooms, room types, and dimensions. It returns a structured JSON layout schema for frontend visualization and interaction.

---

## 📦 Features

- Generate 2D layout schemas based on input home parameters
- View, save, and delete generated layouts
- Retrieve individual layout by ID
- Retrieve user-defined home parameters
- Token-based authorization for sensitive actions
- Easily pluggable into a microservices architecture

---

## ⚙️ Tech Stack

- **Backend:** Node.js, Express.js
- **Authentication:** JWT (verifyToken middleware)
- **Data Format:** JSON
- **Deployment:** Docker, Render
- **Storage:** Can be integrated with MongoDB or other databases (not shown here)

---

## 📁 Project Structure

layout-service/
│
├── controllers/
│   └── layout.controllers.js       # Controller logic for layout routes
│
├── routes/
│   └── layout.routes.js            # API endpoints for layout service
│
├── utils/
│   └── token.js                    # JWT token verification logic
│
├── models/
│   └── layout.model.js             # (Optional) Mongoose schema or data model
│
├── uploads/                        # (Optional) To store generated layout files or images
│
├── Dockerfile                      # Dockerfile for containerizing the service
├── .dockerignore                   # Ignore files/folders during Docker build
├── package.json                    # Project dependencies and scripts
├── .env                            # Environment variables
└── index.js                        # Entry point of the service

| Method | Route                  | Auth Required | Description                             |
| ------ | ---------------------- | ------------- | --------------------------------------- |
| GET    | `/all-layout`          | ✅             | Fetch all layouts created by the user   |
| GET    | `/layout/:id`          | ✅             | Get a specific layout by its ID         |
| GET    | `/home-parameters/:id` | ✅             | Get home input parameters by layout ID  |
| POST   | `/create-layout`       | ❌             | Generate layout from input parameters   |
| POST   | `/save-layout`         | ✅             | Save a generated layout to the database |
| DELETE | `/delete-layout/:id`   | ✅             | Delete a layout by its ID               |


---

## 📌 API Endpoints

> All sensitive endpoints are secured via JWT `verifyToken` middleware.

### 1. `GET /api/layout/all-layout`
- **Protected:** ✅
- **Description:** Fetch all saved layouts for the authenticated user.

---

### 2. `GET /api/layout/layout/:id`
- **Description:** Fetch a single layout by its unique ID.
- **Params:** `id` — Layout ID.

---

### 3. `GET /api/layout/home-parameters/:id`
- **Description:** Retrieve home parameter input used to generate a layout.
- **Params:** `id` — Layout ID or User ID based on implementation.

---

### 4. `POST /api/layout/create-layout`
- **Description:** Accept home parameters (number of rooms, types, dimensions, etc.) and generate a layout.
- **Request Body Example:**
```json
{
  "width": 40,
  "height": 30,
  "rooms": [
    { "type": "master", "width": 12, "height": 10 },
    { "type": "kitchen", "width": 10, "height": 8 }
  ],
  "vehicleCount": { "car": 1, "bike": 2 }
}

Response: JSON layout schema with coordinates.

5. POST /api/layout/save-layout
Protected: ✅

Description: Save a generated layout to the database for later access.

6. DELETE /api/layout/delete-layout/:id
Protected: ✅

Description: Delete a layout by ID.

🚀 Deployment
📦 Docker
Ensure Docker is installed.

# Build the image
docker build -t layout-service .

# Run the container
docker run -d -p 5002:5002 --env-file .env layout-service

☁️ Render Deployment
Go to Render.

Click on "New Web Service".

Connect your GitHub repo.

Set build command: npm install

Set start command: node index.js

Set environment variables in Render dashboard.

Deploy and monitor logs.

🔐 Environment Variables (.env)
PORT=5002
JWT_SECRET=your_secret_key
DB_URL=mongodb_connection_string

📬 Example JSON Response (Layout Schema)
{
  "rooms": [
    {
      "id": "room1",
      "label": "Master Bedroom",
      "type": "master",
      "x": 0,
      "y": 0,
      "width": 12,
      "height": 10
    },
    {
      "id": "room2",
      "label": "Kitchen",
      "type": "kitchen",
      "x": 12,
      "y": 0,
      "width": 10,
      "height": 8
    }
  ],
  "totalWidth": 40,
  "totalHeight": 30
}

