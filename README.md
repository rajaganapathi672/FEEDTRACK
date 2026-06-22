# FeedTrack

[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/siby369/FeedTrack?style=social)](https://github.com/siby369/FeedTrack/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/siby369/FeedTrack?style=social)](https://github.com/siby369/FeedTrack/network/members)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![GitHub issues](https://img.shields.io/github/issues/siby369/FeedTrack)](https://github.com/siby369/FeedTrack/issues)

A powerful **Student Feedback Analytics** platform designed to collect, analyze, and visualize feedback data. FeedTrack leverages AI to provide actionable insights, helping institutions improve their educational standards.

🌐 **Live Website:** [FeedTrack Live Demo](https://feedtrack-flame.vercel.app/)

## Screenshots

<!-- ![FeedTrack Dashboard](public/preview.png) -->

## Features

- **Interactive Analytics**: Visualise feedback data with dynamic charts using Recharts.
- **AI-Powered Insights**: Integrated Google GenAI for summarizing feedback and detecting trends.
- **Report Generation**: Export comprehensive analytics reports to standard formats like PDF.
- **Secure Authentication**: Robust user management with JWT and Bcrypt authentication.
- **Responsive Design**: optimized for seamless usage across all devices.
- **Fast & Modern**: Built with Vite and React for high performance.

## Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB instance

### Installation

```bash
# Clone the repository
git clone https://github.com/siby369/FeedTrack.git

# Navigate to project directory
cd FeedTrack

# Install dependencies (Root, Frontend, and Backend)
npm install
```

### Running Locally

**Frontend**
```bash
cd frontend
npm run dev
```

**Backend**
```bash
cd backend
# Create a .env file with your credentials (MONGO_URI, JWT_SECRET, GEMINI_API_KEY)
npm start
```

## Project Structure

```
FeedTrack/
├── frontend/           # React + Vite frontend application
│   ├── src/            # Source code
│   └── public/         # Static assets
├── backend/            # Express.js API server
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   └── controllers/    # Request handlers
├── api/                # Serverless function entry points
└── README.md           # Project documentation
```

## Contributing

Contributions are always welcome! Here's how you can help:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Siby R

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Contact

**Developer** - [Rajaganpathi M](https://github.com/rajaganapathi672)

**Project Link:** [https://github.com/siby369/FeedTrack](https://github.com/rajaganapathi672/FeedTrack)

## Acknowledgments

- [Google GenAI](https://ai.google.dev/) - For providing powerful AI capabilities
- [Vercel](https://vercel.com/) - For hosting and deployment
- [Recharts](https://recharts.org/) - For beautiful data visualization
