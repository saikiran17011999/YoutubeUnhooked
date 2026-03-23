# Personal Video Knowledge Manager

A production-quality web application for managing YouTube videos with personal notes, AI-powered summaries, and organized categories.

## 🚀 Features

- **Save Videos**: Add YouTube videos or playlists via URL
- **Video Management**: Organize with categories, favorites, and watch status
- **Personal Notes**: Add, edit, and manage notes per video
- **AI Summaries**: LLM-powered video and notes summarization
- **YouTube-like UI**: Familiar, intuitive interface

## 🏗️ Architecture

```
video-knowledge-manager/
├── backend/                 # Node.js + Express API
│   └── src/
│       ├── features/        # Feature-based modules
│       │   ├── videos/      # Video management
│       │   ├── notes/       # Notes system
│       │   ├── categories/  # Category management
│       │   ├── llm/         # LLM abstraction layer
│       │   └── user/        # User management
│       ├── middleware/      # Express middleware
│       ├── config/          # App configuration
│       ├── utils/           # Shared utilities
│       └── database/        # Database connection
├── frontend/                # React + TailwindCSS
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── pages/           # Route pages
│       ├── hooks/           # Custom React hooks
│       ├── services/        # API service layer
│       ├── context/         # React context providers
│       └── utils/           # Frontend utilities
└── docs/                    # Project documentation
```

## 🛠️ Tech Stack

| Layer      | Technology           |
|------------|---------------------|
| Backend    | Node.js, Express.js |
| Frontend   | React, TailwindCSS  |
| Database   | MongoDB             |
| LLM        | Abstracted (OpenAI, Claude, etc.) |

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd video-knowledge-manager
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Configure environment:
```bash
# Backend
cp backend/.env.example backend/.env
# Edit .env with your MongoDB URI and LLM API keys

# Frontend
cp frontend/.env.example frontend/.env
```

5. Start development servers:
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

## 📚 Documentation

- [Architecture Overview](docs/architecture.md)
- [API Contracts](docs/api-contracts.md)
- [LLM Prompts](docs/llm-prompts.md)

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

## 📄 License

MIT License
