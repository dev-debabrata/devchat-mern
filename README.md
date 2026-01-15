# Real-Time Chat App (MERN + Socket.IO)

A full-featured real-time chat application built with the MERN stack and Socket.IO, supporting live messaging, authentication, online status, typing indicators, and a modern responsive UI.

> This project demonstrates strong skills in full-stack web development, real-time systems, and clean UI design.

---

## 📸 Screenshots

### Login Page

![Login Page](./frontend/public/login.png)

### SignUp Page

![SignUp Page](./frontend/public/signup.png)

### Home Page

![Home page](./frontend/public/chatlist.png)

### Contact List

![Contact List](./frontend/public/contactlist.png)

### Chat Page

![Chat page](./frontend/public/chatpage.png)

### Profile Page

![Profile page](./frontend/public/profile.png)

### User Profile Page

![Suggestion Profile page](./frontend/public/userprofile.png)

---

## Features

- Secure Authentication (Login / Signup using JWT)
- Real-time messaging with Socket.IO
- Online / Offline user status
- Typing indicator
- User profile modal
- Zustand for state management
- Fully responsive for mobile & desktop
- MongoDB for persistent storage
- Fast and optimized UI with React + Tailwind
- Auto update chat without refresh

---

## Tech stack

- Frontend: React (Create React App or Vite) + React Router + Zustand + Axios + Tailwind CSS
- Backend: Node.js + Express + Socket.IO
- Database: MongoDB (Mongoose ODM)
- Authentication: JWT (JSON Web Tokens)
- File storage: local uploads for dev or S3-compatible for production
- Dev tooling: ESLint, Prettier, concurrently (optional)

---

## Repository structure

```
chat-app/
│
├── client/        # React frontend
│   ├── components/
│   ├── pages/
│   ├── store/
│   └── App.jsx
│
├── server/        # Node backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   └── index.js
│
└── README.md

```

---

## Installation Guide

```bash
1. Clone the repository
git clone https://github.com/your-username/your-repo-name.git

2. Open project
cd your-repo-name

3. Install backend dependencies
cd server
npm install

4. Install frontend dependencies
cd client
npm install

```

---

## Run the Project

```bash
Start backend:

cd server
npm start


Start frontend:

cd client
npm run dev


Open browser:

http://localhost:5173

```

---

## What I Learned From This Project

- Building real-time apps using Socket.IO
- Managing global state using Zustand
- Authentication with JWT
- Structuring full-stack MERN applications
- REST API development
- UI/UX design using Tailwind CSS
- Clean code and reusable components

---

## Author

**Debabrata Das**  
🎓 B.Tech in Computer Science Engineering  
💻 MERN Stack Developer

- GitHub: https://github.com/dev-debabrata
- LinkedIn: https://www.linkedin.com/in/dev-debabrata
