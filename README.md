# 📱 Campus Connect

A full-stack MERN app for students to connect, buy/sell items, and help each other on campus.

---

## 🚀 Features

- 🔐 User authentication (register/login)
- 🧑‍🎓 Student-to-student communication
- 🛍️ Buy/sell used products (books, gadgets, etc.)
- 🗂️ Share notes, resources, and materials
- 🧭 Role-based access (e.g., junior/senior)
- 💬 Ask doubts and get help from seniors

---

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT, bcrypt

---

## ⚙️ Installation (Local Setup)

```bash
# Clone the repository
git clone https://github.com/your-username/campus-connect.git

# Go to the project directory
cd campus-connect

# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..

# Install server dependencies
cd server
npm install
cd ..

# Set up environment variables
# Copy server/.env.example to server/.env and add your MongoDB connection string
cp server/.env.example server/.env
# Edit server/.env with your MongoDB Atlas URI

# Run the app (both frontend and backend)
npm run dev

