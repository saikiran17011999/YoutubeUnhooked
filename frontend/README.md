# Video Knowledge Manager - Frontend

React + TailwindCSS frontend for the Personal Video Knowledge Manager.

## 🏗️ Architecture

```
src/
├── components/         # Reusable UI components
│   ├── common/         # Buttons, Modals, Inputs
│   ├── layout/         # Header, Sidebar, Layout
│   ├── video/          # Video-related components
│   └── notes/          # Notes-related components
├── pages/              # Route pages
├── services/           # API service layer
├── hooks/              # Custom React hooks
├── context/            # React context providers
├── utils/              # Utility functions
└── styles/             # Global styles
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Backend API running on port 5000

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`.

## 🎨 UI Features

### YouTube-like Interface
- Dark theme by default
- Familiar sidebar navigation
- Video card grid layout
- Responsive design

### Video Management
- Add videos via URL
- Import playlists
- Filter by category, status
- Search videos

### Notes System
- Add timestamped notes while watching
- Pin important notes
- AI-powered note summarization

### Status Tracking
- Mark as watched
- Add to favorites
- Watch again list

## 📁 Components

### Common
- `Button` - Primary, secondary, ghost variants
- `Modal` - Reusable modal dialog
- `Input` - Form input with validation
- `Loader` - Spinner and skeleton loaders

### Layout
- `Layout` - Main app layout wrapper
- `Header` - Top navigation with search
- `Sidebar` - YouTube-like sidebar navigation

### Video
- `VideoCard` - Thumbnail card with status
- `VideoGrid` - Responsive grid layout
- `VideoPlayer` - YouTube embed player
- `StatusToggle` - Watch/favorite buttons
- `AddVideoModal` - Add video form

### Notes
- `NotesPanel` - Notes display and management

## 🔧 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🛠️ Tech Stack

- **React 18** - UI framework
- **React Router** - Client-side routing
- **TanStack Query** - Server state management
- **TailwindCSS** - Utility-first CSS
- **Axios** - HTTP client
- **Lucide React** - Icons
- **React Player** - YouTube embed
- **React Hot Toast** - Notifications

## 📄 License

MIT
