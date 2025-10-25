# 📚 Bookshelf Server

A Node.js & Express backend API for managing books, reviews, user roles, subscriptions, and contact messages. Authentication is handled via Firebase, and data is stored in MongoDB Atlas.

---

## 🚀 Features

- 🔐 Firebase Authentication with token verification
- 📚 Full book management (CRUD operations)
- 📝 Review system for books
- 🧑‍💻 User roles & admin features
- 📧 Subscription & contact message handling
- 🔍 Filtering & search capabilities
- 📊 Top-voted books API
- 🌐 MongoDB Atlas integration
- 🛡️ Secure configuration via environment variables

---

## 🛠️ Tech Stack

- Node.js
- Express
- Firebase Admin SDK
- MongoDB & MongoDB Atlas
- dotenv
- CORS

---

## 🔐 Authentication

- Protected routes require the `Authorization` header:  

---

## 📚 Books API

| Method | Endpoint             | Description                          | Protected |
|--------|----------------------|--------------------------------------|-----------|
| GET    | `/books`             | Get all books by user email          | ✅        |
| GET    | `/filtered`          | Filter books by category/search      | ✅        |
| GET    | `/book/:id`          | Get a specific book by ID            | ❌        |
| POST   | `/addBook`           | Add a new book                       | ✅        |
| PUT    | `/book/:id`          | Fully update a book by ID            | ✅        |
| PATCH  | `/book/:id`          | Partially update a book by ID        | ❌        |
| DELETE | `/book/:id`          | Delete a book by ID                  | ❌        |
| GET    | `/hightestUpvoto`    | Get top 6 books sorted by upvotes    | ❌        |

---

## 📝 Reviews API

| Method | Endpoint             | Description                          | Protected |
|--------|----------------------|--------------------------------------|-----------|
| POST   | `/review`            | Add a new review                     | ❌        |
| GET    | `/review/:id`        | Get reviews for a specific book      | ✅        |
| PATCH  | `/review/:id`        | Update a review by ID                | ❌        |
| DELETE | `/review/:id`        | Delete a review by ID                | ❌        |

---

## 🧑‍💻 User Roles

- **POST** `/user-role` – Create a user role  
- **GET** `/get-user-role?email=<email>` – Get role by email (protected)

---

## 📧 Subscription API

- **POST** `/subscription` – Subscribe a user

---

## 📨 Contact Messages

- **POST** `/contact-us-by-user` – Submit a contact message  
- **GET** `/contact-us` – Get all messages (admin only)

---

## 🛡️ Admin Overview

- **GET** `/admin/overview` – Fetch dashboard stats (protected/admin only)
- Total users
- Total books
- Total reviews
- Total subscriptions
- Top 5 books by upvotes

---

## ⚙️ Environment Variables

```bash
PORT=3000

# MongoDB credentials
DB_USER=yourMongoDBUsername
DB_PASSWORD=yourMongoDBPassword

# Firebase Admin credentials (Base64-encoded serviceAccountKey.json)
Firebase_admin=yourBase64EncodedFirebaseServiceAccountJSON
