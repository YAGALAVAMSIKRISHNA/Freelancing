# SB Works - Freelancing Platform

SB Works is a full-stack freelancing platform that allows clients to post projects and freelancers to bid, collaborate, and submit work. It includes features like chat, notifications, user roles, and an admin dashboard.

---

## 🚀 Tech Stack

### Frontend:

* React.js
* HTML, CSS, JavaScript
* Bootstrap (for responsiveness)

### Backend:

* Node.js
* Express.js

### Database:

* MongoDB (Mongoose ODM)

### Security:

* JWT for authentication
* Bcrypt for password hashing
* Helmet, CORS for security best practices

---

## 📁 Folder Structure

```bash
SB-Works/
├── client/                    # Frontend (React)
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       ├── App.js
│       └── index.js
│
├── server/                    # Backend (Node + Express)
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── .env
│
└── README.md
```

---

## 🔑 Core Features

### ✅ User Authentication

* Role-based login (freelancer/client)
* JWT-based secure auth
* Protected routes

### 📝 Project Posting (Clients)

* Create, edit, delete projects
* Add title, category, budget, and description

### 💼 Bidding System (Freelancers)

* Browse and bid on projects
* Upload portfolio links/files

### 💬 Chat System

* Real-time messaging using Socket.io
* Chat between freelancer and client

### 🧑‍💼 Admin Dashboard

* View all users and projects
* Approve/reject projects or user accounts
* Resolve disputes

### 🔔 Notifications

* For bid status, messages, and approvals

### ✅ Project Submission & Feedback

* Freelancers submit work
* Clients leave feedback and ratings

### 👤 User Profiles

* View past work, reviews, and skill sets

---

## 🔐 Security

* JWT Auth
* Bcrypt password hashing
* Input sanitization and validation (Express Validator)
* Helmet, CORS enabled

---

## 📌 API Structure

* Follows RESTful architecture
* Organized routes for auth, projects, bids, chat, admin
* Error handling middleware for clean responses

---

## 📲 How to Run the App

### 1. Clone the Repository:

```bash
git clone https://github.com/your-username/sb-works.git
```

### 2. Run Backend

```bash
cd server
npm install
npm start
```

### 3. Run Frontend

```bash
cd client
npm install
npm start
```

---

## 📖 Case Study - Sarah the Freelancer

**Scenario:**

* Sarah signs up as a freelancer.
* She browses projects under "Web Development."
* She finds a gig by "John the Client" offering \$500.
* Sarah places a bid and adds her portfolio.
* John accepts her bid and they communicate via chat.
* Sarah completes the work and submits.
* John approves and gives a 5⭐ review.
* Sarah’s profile gets updated with the review and job history.

---

## ✅ To Do (Future Improvements)

* Payment gateway integration
* File upload support in chat
* Advanced search and filtering
* Mobile app version

---

## 🤝 Contribution

Feel free to fork and contribute! Create a pull request and mention your feature/improvement.

---

## 📧 Contact

Developed by Vamsi
Email: [vamsikrishnayadhav321@gmail.com](mailto:vamsikrishnayadhav321@gmail.com)

---

## 📝 License

MIT License
