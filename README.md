# 📚 Bookshelf Server

A Node.js and Express backend API for managing books and user reviews, with authentication via Firebase and data stored in MongoDB.

---

## 🚀 Features

- 🔐 Firebase Authentication (with token verification)
- 📚 Book management (CRUD operations)
- 📝 Review system for books
- 🔍 Filtering & searching capabilities
- 📊 Top-voted books API
- 🌐 MongoDB Atlas integration
- 🛡️ Environment variable-based secure configuration

---

## 🛠️ Tech Stack

- Node.js
- Express
- Firebase Admin SDK
- MongoDB & MongoDB Atlas
- dotenv
- CORS

---


### 🔐 Auth Middleware

- Protected routes require the `Authorization` header:  
  `Bearer <FirebaseIDToken>`

---

### 📚 Books

| Method | Endpoint             | Description                          | Protected |
|--------|----------------------|--------------------------------------|-----------|
| GET    | `/books`             | Get all books by user email          | ✅        |
| GET    | `/filtered`          | Filter books by category/search      | ✅        |
| GET    | `/book/:id`          | Get a specific book by ID            | ❌        |
| POST   | `/addBook`           | Add a new book                       | ❌        |
| PUT    | `/book/:id`          | Fully update a book by ID            | ❌        |
| PATCH  | `/book/:id`          | Partially update a book by ID        | ❌        |
| DELETE | `/book/:id`          | Delete a book by ID                  | ❌        |
| GET    | `/hightestUpvoto`    | Get top 6 books sorted by upvotes    | ❌        |

---

### 📝 Reviews

| Method | Endpoint             | Description                          | Protected |
|--------|----------------------|--------------------------------------|-----------|
| POST   | `/review`            | Add a new review                     | ❌        |
| GET    | `/review/:id`        | Get reviews for a specific book      | ✅        |
| PATCH  | `/review/:id`        | Update a review by ID                | ❌        |
| DELETE | `/review/:id`        | Delete a review by ID                | ❌        |


PORT=3000

# MongoDB credentials
|Name|Value|
|------------|------------------|
|DB_USER|yourMongoDBUsername |
|DB_PASSWORD|yourMongoDBPassword|

# Firebase Admin credentials (Base64-encoded serviceAccountKey.json)
|Name|Value|
|-------|---------|
|Firebase_admin|yourBase64EncodedFirebaseServiceAccountJSON|
