# Secure Note-Taking API (Backend)

This is a robust, production-ready REST API built with **Node.js, Express, and MongoDB**. It serves as the core for a secure note-taking application, featuring advanced Database Aggregations, strict Indexing, and Role-Based Access Control (RBAC).

## 🛡️ Security Features
This API is fortified against common web vulnerabilities:
- **Helmet**: Secures HTTP headers.
- **Express Rate Limit**: Prevents DDoS and brute-force attacks (Limits requests to 100 per 10 minutes per IP).
- **Express Mongo Sanitize**: Protects against NoSQL Injection attacks.
- **HPP**: Protects against HTTP Parameter Pollution.
- **CORS**: Strictly configured to accept requests only from allowed domains.
- **Bcrypt & JWT**: Secure password hashing and token-based stateless authentication.

## 🚀 Core Functionalities

### 1. Strict Database Indexing & Optimizations
Indexes were explicitly applied using `schema.index` to guarantee highly performant queries:
- `User`: `{ email: 1 }` (Fast logins), `{ role: 1 }` (Admin lookups), `{ interests: 1 }` (Aggregations).
- `Note`: `{ author: 1, _id: -1 }` (Optimal pagination for fetching user notes).
- `Post`: `{ user: 1 }` (Optimal foreign key matching in `$lookup`).

### 2. Aggregation Pipelines
- **Scenario 1:** Groups users by interests using `$unwind` and `$group`.
- **Scenario 2:** Retrieves user posts efficiently utilizing the `$lookup` pipeline.

### 3. Auto-Seeding
When the server starts, it automatically creates a Default Admin if no admin exists in the database.
- **Email:** `superadmin@gmail.com`
- **Password:** `superadmin1234`

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB URI (Atlas or Local)

### Installation
1. Clone the repository and navigate to the backend folder:
   ```bash
   cd note-taking-application-backend
   npm install
   ```

2. Create a `.env` file in the root of the backend folder:
   ```env
   PORT=5001
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   ```

3. Start the server:
   ```bash
   npm run dev
   ```

---

## 📡 API Endpoints

### Auth Endpoints
- `POST /api/auth/register` - Register a new user (`name`, `email`, `password`, `role`)
- `POST /api/auth/login` - Authenticate and retrieve JWT

### Note Endpoints (Protected)
- `GET /api/notes` - Retrieve paginated notes (Admin sees all; User sees only their own)
- `POST /api/notes` - Create a secure note
- `PUT /api/notes/:id` - Update an existing note
- `DELETE /api/notes/:id` - Delete a note permanently

### User & Aggregation Endpoints (Admin Only)
- `GET /api/users` - Retrieve paginated list of all users
- `GET /api/users/stats/interests` - Aggregation Scenario 1
- `GET /api/users/:id/posts` - Aggregation Scenario 2
