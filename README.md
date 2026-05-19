# FeedTrack 📝

A responsive full-stack feedback management web application built with the MERN stack, enabling real-time content feed, user interaction, and seamless feedback collection.

🌐 **Live Demo:** [feedtrack-flame.vercel.app](https://feedtrack-flame.vercel.app/)

---

## 🚀 Features

- 🔐 User Authentication — Secure sign-up and login
- 📡 Real-Time Feed — Dynamic feed updates without page reload
- 💬 Feedback Submission — Users can submit and view feedback instantly
- 📊 Admin Dashboard — Manage and monitor feedback entries
- 📱 Responsive Design — Mobile-friendly UI across all screen sizes
- ⚡ Optimized Performance — Fast load times with efficient front-end rendering

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js, TypeScript, Tailwind CSS, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| API | RESTful API (Node.js) |
| Deployment | Vercel |
| Language | TypeScript (68%), JavaScript (24%), HTML (5%), Python (3%) |

---

## 📁 Project Structure

```
FEEDBACK-/
├── frontend/        # React + TypeScript client
├── backend/         # Node.js + Express server
├── api/             # RESTful API handlers
├── backdate.py      # Python utility script
├── vercel.json      # Vercel deployment config
└── package.json     # Project dependencies
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rajaganapathi672/FEEDBACK-.git
   cd FEEDBACK-
   ```

2. **Install dependencies**
   ```bash
   # Root dependencies
   npm install

   # Frontend
   cd frontend && npm install

   # Backend
   cd ../backend && npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the `backend/` directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. **Run the development server**
   ```bash
   # Start backend
   cd backend && npm run dev

   # Start frontend (in a new terminal)
   cd frontend && npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

---

## 🚢 Deployment

This project is deployed on **Vercel**. The `vercel.json` config handles routing between the frontend and API endpoints.

To deploy your own instance:
```bash
npm install -g vercel
vercel --prod
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add YourFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 👨‍💻 Author

**Rajaganapathi M**
- GitHub: [@rajaganapathi672](https://github.com/rajaganapathi672)
- LinkedIn: [Raja Ganapathi M](https://linkedin.com/in/rajaganapathi672)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
