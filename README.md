# 🖥️ TaskFlow Backend – Node.js & Express API

This is the backend API for the **TaskFlow** application, built with **Node.js** and **Express**.  
It provides endpoints for user authentication, task management, and secure communication with the frontend.

---

## 🚀 Features

- 🔐 User authentication (Sign Up, Login, JWT Tokens)
- 📌 CRUD operations for tasks
- ⚡ Task status management (Todo, In Progress, Done)
- 🛡️ Each user can only access their own tasks
- 🔄 Axios-ready API for seamless frontend integration

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** (or your database)
- **Mongoose** (for MongoDB models)
- **JWT** (Authentication)
- **bcryptjs** (Password hashing)
- **Cors** (Cross-origin requests)
- **dotenv** (Environment variables)
- **Axios** (For frontend requests)

---

### Users 
POST /api/users/register
POST /api/users/login
GET  /api/users/me
PUT  /api/users/:id
DELETE /api/users/:id (Admin only)

### Tasks
GET    /api/tasks
POST   /api/tasks
GET    /api/tasks/:id
PUT    /api/tasks/:id
DELETE /api/tasks/:id



## My personal information
**Author:** Kareem Marwan  
**Email:** kareemmarwan1995@gmail.com  
**GitHub:** https://github.com/kareemmarwan  
**LinkedIn:** https://www.linkedin.com/in/kareem-marwan-949646b2/



## ⚙️ Installation & Setup

1. Clone the repository:
```bash
git clone https://github.com/kareemmarwan/taskflow-backend.git
